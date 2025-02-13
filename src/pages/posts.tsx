import { repository } from "@/lib/info";
import type { Post } from "@/lib/types";
import { Footer } from "@/ui/footer";
import { PostCard } from "@/ui/post-card";
import { Share } from "@/ui/share";

export const Posts = (props: { post: Post }) => {
	const { post } = props;

	return (
		<div class="mx-auto w-full max-w-[90ch] pt-6">
			<main>
				<article>
					<PostCard post={post} headings link={false} />

					<div class="prose mt-10">{post.html}</div>
					<hr class="my-8" />

					<div class="flex gap-4">
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
