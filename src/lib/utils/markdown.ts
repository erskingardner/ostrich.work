import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { mangle } from 'marked-mangle';
import DOMPurify from 'isomorphic-dompurify';

export function cleanMarkdown(content: string): string {
    marked.use(mangle());
    marked.use(gfmHeadingId());

    return DOMPurify.sanitize(
        // eslint-disable-next-line no-misleading-character-class
        marked.parse(content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ''))
    );
}
