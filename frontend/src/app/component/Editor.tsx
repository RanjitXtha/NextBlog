'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { FC, useRef } from 'react';
import type { ReactQuillProps } from 'react-quill';
import { forwardRef } from 'react';
import axios from 'axios';

const ReactQuill = dynamic(() =>
  import('react-quill-new').then((mod) =>
    forwardRef<any, ReactQuillProps>((props, ref) => (
      <mod.default {...props} ref={ref} />
    ))
  ), { ssr: false }
);

ReactQuill.displayName = 'ReactQuill';

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
    handlers: {
      image: () => {}, 
    },
  },
};

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

const Editor: FC<EditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<any>(null);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('http://localhost:5000/api/upload-image', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        const imageUrl = data.url;
        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection();
        if (range && editor) {
          editor.insertEmbed(range.index, 'image', imageUrl);
          editor.setSelection(range.index + 1);
        }
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    };
  };

  modules.toolbar.handlers.image = handleImageUpload;

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
};

export default Editor;
