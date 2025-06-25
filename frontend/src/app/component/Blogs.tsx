import Image from "next/image";

export default function BlogList({ blogs }: { blogs: any[] }) {
  return (
    <div>
      <h1>Blogs</h1>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <ul>
          {blogs.map((blog) => (
            <li key={blog._id} className="mb-8 border-b pb-4">
              <h2 className="text-xl font-bold">{blog.title}</h2>
              <p className="text-gray-600">{blog.des}</p>

              {blog.banner && (
                <Image
                  src={`https://res.cloudinary.com/dm93amldk/image/upload/v1750780145/${blog.banner}`}
                  alt={blog.title}
                  width={300}
                  height={200}
                  className="my-2"
                />
              )}

              {/* ✅ Render HTML content safely */}
              {blog.content && (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
