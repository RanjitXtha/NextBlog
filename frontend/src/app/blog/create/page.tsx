'use client';

import Editor from '@/app/component/Editor';
import { useState } from 'react';

export default function BlogEditorPage() {
  const [title, setTitle] = useState('');
  const [des, setDes] = useState('');
  const [banner, setBanner] = useState<File | null>(null);
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('des', des);
    formData.append('content', content);
    formData.append('tags', tags); // comma-separated string
    if (banner) formData.append('banner', banner);

    try {
      setIsSubmitting(true);
      const res = await fetch('http://localhost:5000/api/blog/create', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('Blog posted successfully!');
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <input
        type="text"
        placeholder="Short Description"
        value={des}
        onChange={(e) => setDes(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setBanner(e.target.files?.[0] || null)}
        className="mb-3"
      />

      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <Editor value={content} onChange={setContent} />

      <button
        onClick={handleSubmit}
       
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Blog'}
      </button>
    </div>
  );
}
