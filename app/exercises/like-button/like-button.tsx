"use client";

import { HeartIcon, SpinnerIcon } from "./icons";
import { useState } from "react";

import "./styles.css";

export default function LikeButton({
  defaultLiked = false,
}: {
  defaultLiked?: boolean;
}) {
  const { data, error, isLiked, isPending, toggleLike } = useLike({
    defaultLiked,
  });

  return (
    <div>
      <button
        onClick={toggleLike}
        disabled={isPending}
        className={["like-button", isLiked && "liked", isPending && "pending"]
          .filter(Boolean)
          .join(" ")}
      >
        {isPending ? <SpinnerIcon /> : <HeartIcon />}
        <span>{isLiked ? "Unlike" : "Like"}</span>
      </button>
      <div className="error" role="alert" hidden={!error}>
        {error && error}
      </div>
    </div>
  );
}

function useLike({ defaultLiked = false }: { defaultLiked?: boolean }) {
  const [isLiked, setIsLiked] = useState(defaultLiked);
  const [isPending, setIsPending] = useState(false);
  type State = { data: string | null; error: string | null };
  const [{ data, error }, setData] = useState<State>({
    data: null,
    error: null,
  });

  const ENDPOINT = "https://www.greatfrontend.com/api/questions/like-button";

  async function toggleLike() {
    setData({ data: null, error: null });
    setIsPending(true);

    const action = isLiked ? "unlike" : "like";

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: action }),
      });

      const {
        message,
      }: {
        message: string;
      } = await res.json();

      if (!res.ok) {
        setData({ data: null, error: message });
        return;
      }

      setIsLiked((l) => !l);
      setData({ data: message, error: null });
    } catch (e) {
      setData({
        data: null,
        error: "Something went wrong with the API.",
      });
    } finally {
      setIsPending(false);
    }
  }

  return {
    data,
    error,
    isLiked,
    isPending,
    toggleLike,
  };
}
