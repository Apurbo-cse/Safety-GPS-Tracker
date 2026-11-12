// jQuery and Summernote ship without TypeScript types; the editor wrapper (admin/RichEditor.tsx) talks to them as `any`.
declare module "jquery";
declare module "summernote/dist/summernote-lite.min.js";
