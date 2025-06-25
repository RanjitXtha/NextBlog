import Image from "next/image";
import axios from "axios";
import Blogs from "./component/Blogs";

async function fetchBlogs() {
  const res = await fetch('http://localhost:5000/blog/getblogs', {
    cache: 'no-store', // Ensures SSR behavior on every request
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}


export default async function Home() {
const blogs = await fetchBlogs();
console.log(blogs.blogs)
  return (
    <div>
        Hello
        <Blogs blogs={blogs.blogs} />
    </div>
  );
}
