"use client";

import { useMemo, useState, useTransition } from "react";
import { ImageUp, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useLang } from "@/components/i18n/language-provider";
import { createPost } from "@/lib/actions/posts";
import { createClient } from "@/lib/supabase/client";
import { PLATFORM, PLATFORMS, STATUS_LABEL, type Channel } from "@/lib/demo/data";
import { canPublish, PUBLISHABLE_PLATFORMS } from "@/lib/publishing";

const FIELD =
  "flex h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors";

/** Instagram is strict about what it will fetch: JPEG stills, MP4 video. */
const ACCEPTED = ["image/jpeg", "video/mp4"];
const MAX_BYTES = 50 * 1024 * 1024;

type PostType = "IMAGE" | "REELS" | "STORIES";

/** A photo can be a feed post or a story; a video can be a reel or a story. */
function typesFor(isVideoFile: boolean): PostType[] {
  return isVideoFile ? ["REELS", "STORIES"] : ["IMAGE", "STORIES"];
}

/** `datetime-local` gives wall-clock text; the browser knows the zone, so turn
 *  it into a real instant here rather than guessing on the server. */
function toInstant(localValue: string): string {
  if (!localValue) return "";
  const parsed = new Date(localValue);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
}

export function NewPostButton({ channels, disabled }: { channels: Channel[]; disabled?: boolean }) {
  const { ui } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={disabled} className="rounded-full">
        <Plus className="h-4 w-4" /> {ui.newPost}
      </Button>
      {open && <PostDialog channels={channels} onClose={() => setOpen(false)} />}
    </>
  );
}

function PostDialog({ channels, onClose }: { channels: Channel[]; onClose: () => void }) {
  const { ui, t } = useLang();
  const supabase = useMemo(() => createClient(), []);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState<{ url: string; name: string; isVideo: boolean } | null>(null);
  const [postType, setPostType] = useState<PostType>("IMAGE");

  /** Uploads straight to Storage: the file has to sit at a public URL before
   *  Instagram can fetch it, and routing it through the server buys nothing. */
  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !supabase) return;

    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError(ui.mediaWrongType);
      event.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(ui.mediaTooBig);
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error(ui.errGeneric);

      // Storage policy only lets a user write inside media/<their id>/.
      const extension = file.type === "video/mp4" ? "mp4" : "jpg";
      const path = `${auth.user.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("media").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw new Error(uploadError.message);

      const { data } = supabase.storage.from("media").getPublicUrl(path);
      const isVideoFile = file.type === "video/mp4";
      setMedia({ url: data.publicUrl, name: file.name, isVideo: isVideoFile });
      setPostType(typesFor(isVideoFile)[0]);
    } catch (thrown) {
      setError(thrown instanceof Error ? thrown.message : ui.uploadFailed);
      event.target.value = "";
    } finally {
      setUploading(false);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    form.set("scheduledAt", toInstant(String(form.get("scheduledAt") ?? "")));
    form.delete("mediaFile");
    form.set("mediaUrl", media?.url ?? "");
    form.set("mediaType", media ? postType : "IMAGE");

    startTransition(async () => {
      const result = await createPost(form);
      if (result.ok) onClose();
      else if (result.error === "UNPUBLISHABLE_PLATFORM") setError(ui.cannotSchedule);
      else setError(result.error ?? ui.errGeneric);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">{ui.newPost}</h2>
          <button onClick={onClose} aria-label={ui.cancel} className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="platform">{ui.postPlatform}</Label>
              <select id="platform" name="platform" required className={FIELD} defaultValue={PUBLISHABLE_PLATFORMS[0]}>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p} disabled={!canPublish(p)}>
                    {PLATFORM[p].name}{canPublish(p) ? "" : ` (${ui.comingSoon})`}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground">{ui.onlyInstagram}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="channelId">{ui.postChannel}</Label>
              <select id="channelId" name="channelId" className={FIELD} defaultValue="">
                <option value="">{ui.noChannel}</option>
                {channels.map((c) => <option key={c.id} value={c.id}>{c.handle}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">{ui.postTitle}</Label>
            <Input id="title" name="title" required maxLength={200} autoFocus />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="body">{ui.postBody}</Label>
            <textarea
              id="body" name="body" rows={4} maxLength={5000}
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mediaFile">{ui.postMedia}</Label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-card px-3 py-2.5 text-sm transition-colors hover:border-primary">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <ImageUp className="h-4 w-4 text-muted-foreground" />}
              <span className={media ? "truncate font-medium" : "text-muted-foreground"}>
                {uploading ? ui.uploading : media ? media.name : ui.mediaHint}
              </span>
              <input id="mediaFile" name="mediaFile" type="file" accept="image/jpeg,video/mp4" onChange={upload} className="sr-only" />
            </label>
          </div>

          {media && (
            <div className="space-y-1.5">
              <Label htmlFor="postType">{ui.postType}</Label>
              <div className="flex gap-2">
                {typesFor(media.isVideo).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPostType(type)}
                    className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      postType === type
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {type === "IMAGE" ? ui.typeFeed : type === "REELS" ? ui.typeReel : ui.typeStory}
                  </button>
                ))}
              </div>
              {postType === "STORIES" && <p className="text-[11px] text-muted-foreground">{ui.storyNote}</p>}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="scheduledAt">{ui.postWhen}</Label>
              <Input id="scheduledAt" name="scheduledAt" type="datetime-local" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">{ui.postStatus}</Label>
              <select id="status" name="status" className={FIELD} defaultValue="scheduled">
                {(["scheduled", "draft", "needs_review"] as const).map((s) => (
                  <option key={s} value={s}>{t(STATUS_LABEL[s])}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>{ui.cancel}</Button>
            <Button type="submit" disabled={pending || uploading}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? ui.saving : ui.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
