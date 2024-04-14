import "./Collection.css";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

export interface CollectionProps {
  id: number;
  desc: string;
  img: string;
  price: number;
  userId: number;
}

const Collection: React.FC<{ collection: CollectionProps }> = ({
  collection,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation(
    (collectionId: number) => {
      return makeRequest.delete("/drops/" + collectionId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["drops"]);
      },
    }
  );

  const handleDelete = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    event.stopPropagation();
    deleteMutation.mutate(collection.id);
  };

  const handleNavigate = () => {
    navigate(`/collections/${collection.id}`);
  };
  return (
    <div className="collection" onClick={handleNavigate}>
      <div className="collection-container">
        <div className="pic-container">
          <img
            className="img2"
            src={`http://localhost:8081/${collection.img}`}
            alt="Collection"
          />
        </div>
        <div className="desc-container">{collection.desc}</div>
        <div className="bottom-container">
          <DeleteIcon onClick={handleDelete} />
          <div className="stat-container">
            <h2>Minting</h2>
            <span>Now</span>
          </div>
          <div className="price-container">
            <h2>Price</h2>
            <span>{collection.price} ETH</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
