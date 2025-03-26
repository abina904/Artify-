import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Delete,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import "../styles/WorkCard.scss";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const WorkCard = ({ work }) => {
  console.log("Work Data:", work);

  /* SLIDER FOR PHOTOS */
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { data: session, update } = useSession();
  const userId = session?.user?._id;

  /* Handle Next & Previous Slide */
  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % work.workPhotoPaths.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + work.workPhotoPaths.length) % work.workPhotoPaths.length
    );
  };

  /* DELETE WORK */
  const handleDelete = async () => {
    const hasConfirmed = confirm("Are you sure you want to delete this work?");
    if (!hasConfirmed) return;

    try {
      await fetch(`/api/work/${work._id}`, { method: "DELETE" });
      window.location.reload();
    } catch (err) {
      console.error("Error deleting work:", err);
    }
  };

  /* ADD TO WISHLIST */
  const wishlist = session?.user?.wishlist || [];
  const isLiked = wishlist.some((item) => item?._id === work._id);

  const patchWishlist = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/user/${userId}/wishlist/${work._id}`, { method: "PATCH" });
      const data = await response.json();
      update({ user: { wishlist: data.wishlist } }); // Update session with new wishlist
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  /* SAFEGUARD FOR MISSING DATA */
  const creator = work.creator || { profileImagePath: "/default-profile.png", username: "Unknown" };

  return (
    <div className="work-card" onClick={() => router.push(`/work-details?id=${work._id}`)}>
      {/* IMAGE SLIDER */}
      <div className="slider-container">
        <div className="slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {work.workPhotoPaths?.map((photo, index) => (
            <div className="slide" key={index}>
              <img src={photo} alt="work" />
              <div
                className="prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide();
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide();
                }}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WORK DETAILS */}
      <div className="info">
        <div>
          <h3>{work.title || "Untitled Work"}</h3>
          <div className="creator">
            <img src={creator.profileImagePath} alt="creator" />
            <span>{creator.username}</span> in <span>{work.category || "Uncategorized"}</span>
          </div>
        </div>
        <div className="price">₹{work.price || "N/A"}</div>
      </div>

      {/* DELETE OR WISHLIST ICON */}
      {userId === work?.creator?._id ? (
        <div
          className="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Delete
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              padding: "5px",
              fontSize: "30px",
            }}
          />
        </div>
      ) : (
        <div
          className="icon"
          onClick={(e) => {
            e.stopPropagation();
            patchWishlist();
          }}
        >
          {isLiked ? (
            <Favorite
              sx={{
                borderRadius: "50%",
                backgroundColor: "white",
                color: "red",
                padding: "5px",
                fontSize: "30px",
              }}
            />
          ) : (
            <FavoriteBorder
              sx={{
                borderRadius: "50%",
                backgroundColor: "white",
                padding: "5px",
                fontSize: "30px",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default WorkCard;
