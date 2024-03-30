import "./Market.css";
import Collection from "./Collection";
import { CollectionProps } from "./Collection";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";

const Market = () => {

  const { isLoading, error, data } = useQuery({
    queryKey: ["drops"],
    queryFn: () => makeRequest.get("/drops").then((res) => res.data),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error loading data</div>;
  }
  return (
    <div className="market-block">
      <div className="market-nav">
        <button className="active">Active</button>
      </div>
      <div className="list-items">
        {error
          ? "Error!"
          : isLoading
          ? "Loading..."
          : data &&
            data.map((collection: CollectionProps) => (
              <Collection collection={collection} key={collection.id} />
            ))}
      </div>
    </div>
  );
};

export default Market;
