import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Box, Typography } from "@mui/material";
import ImageCropper from "./ImageCropper";

const DesignImageCrop = forwardRef(({ onCrop }, ref) => {
  const cropperRef = useRef();

  const [aspect, setAspect] = useState();
  const [circularCrop, setCirclarCrop] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      cropperRef.current.selectImage();
    },
  }));

  const handleCrop = (image) => {
    onCrop(image);
  };

  return (
    <ImageCropper
      ref={cropperRef}
      aspect={aspect}
      circularCrop={circularCrop}
      onCrop={handleCrop}
    >
      <Box display="flex" justifyContent="space-between" sx={{ mx: 2, mt: 1 }}>
        <Box
          sx={styles.cropOption}
          className={!circularCrop ? "selected" : ""}
          onClick={() => {
            setAspect(undefined);
            setCirclarCrop(false);
          }}
        >
          <Box sx={styles.rectangle} />
          <Typography sx={{ fontWeight: "bold" }}>Crop</Typography>
        </Box>
        <Box
          sx={styles.cropOption}
          className={circularCrop ? "selected" : ""}
          onClick={() => {
            setCirclarCrop(true);
            setAspect(1);
          }}
        >
          <Box sx={styles.circle} />
          <Typography sx={{ fontWeight: "bold" }}>Crop</Typography>
        </Box>
      </Box>
    </ImageCropper>
  );
});

export default DesignImageCrop;

const styles = {
  wrapper: {
    bgcolor: "white",
    mx: "auto",
    width: "max-content",
    marginTop: "100px",
    paddingLeft: "2px",
    paddingRight: "2px",
    py: 1,
    borderRadius: 1,
  },
  cropper: {
    width: { xs: 350, lg: 400 },
    height: { xs: 350, lg: 400 },
    backgroundColor: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cropOption: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: 120,
    border: "solid 1px #E8E9ED",
    backgroundColor: "#E8E9ED",
    padding: "5px 0px",
    borderRadius: 100,
    cursor: "pointer",

    "&.selected": {
      border: "solid 3px #116dff",
    },
  },
  circle: {
    width: 24,
    height: 24,
    backgroundColor: "black",
    borderRadius: 24,
  },
  rectangle: {
    width: 30,
    height: 24,
    backgroundColor: "black",
  },
};
