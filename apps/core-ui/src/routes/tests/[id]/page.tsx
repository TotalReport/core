import { useParams } from '@modern-js/runtime/router';

function Blog() {
  const { id } = useParams();
  if (id) {
    return <div>current blog ID is: {id}</div>;
  }

  return <div>create new blog</div>;
}
export default Blog;
