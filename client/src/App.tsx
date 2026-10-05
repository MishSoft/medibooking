import { useQuery } from "@tanstack/react-query";
import "./App.css";
import { postsQueryOptions } from "./router/queryClient";

function App() {
  const { data: posts } = useQuery(postsQueryOptions());

  console.log(posts);

  return (
    <h1 className="text-3xl text-center font-bold underline">Hello world!</h1>
  );
}

export default App;
