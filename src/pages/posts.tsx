import { repository } from "@/lib/info";
import type { Post } from "@/lib/types";
import { Footer } from "@/ui/footer";
import { PostCard } from "@/ui/post-card";
import { Share } from "@/ui/share";
import { Chunk } from "ovr";

export const Posts = (props: { post: Post }) => {
	const { post } = props;

	return (
		<div class="mx-auto w-full max-w-[90ch] pt-6">
			<main>
				<article>
					<PostCard post={post} headings link={false} />

					<div class="prose mt-10">{new Chunk(post.html, true)}</div>

					<hr class="my-8" />

					<div class="flex items-center gap-4">
						<a
							class="button"
							href={`${repository}/blob/main/src/content/${post.slug}.md`}
						>
							Edit
						</a>
						<Share slug={post.slug} />
					</div>
				</article>
			</main>

			<Footer />
		</div>
	);
};
