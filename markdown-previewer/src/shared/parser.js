import marked from 'marked';
import DOMPurify from 'dompurify';

marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    link(href, title, text) {
      return `<a href="${href}" ${title ? `title="${title}"` : `` } target="_blank">${text}</a>`;
    }  
  }
});

export const markdownToHTML = markdown => {
  return DOMPurify.sanitize(marked(markdown));
};
