/**
 * Copyright (C) 2020 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, ImageList, ImageListItem, Stack } from "@mui/material";
import Modal from "../../../shared/Modal";
import { TextInput } from "components/shared/input/TextInput";
import { DroppableFileUploadInput } from "components/shared/input/FileInput";

const EmbedImageDialog = ({
  addEmbeddedImage,
  initialImage = null,
  setInitialImage,
  showEmbedImageDialog,
  setShowEmbedImageDialog,
  maxFileSizeMb
}) => {
  const {
    control,
    setValue,
    watch,
    getValues,
    reset: resetForm
  } = useForm({
    mode: "all",
    defaultValues: { imageWidth: 0, imageHeight: 0, scalingFactor: 1.0 }
  });
  const [imageAttachment, setImageAttachment] = useState(null);
  const [originalImageWidth, setOriginalImageWidth] = useState(0);
  const [originalImageHeight, setOriginalImageHeight] = useState(0);
  const scalingFactor = watch("scalingFactor");

  // If provided with an initial image, then use it
  useEffect(() => {
    if (initialImage) {
      setImageAttachment(initialImage);
    }
  }, [initialImage]);

  const onFileChanged = (files) => {
    if (files) {
      setImageAttachment(files[0]);
      checkImageSize(imageAttachment, setSize);
    }
  };

  const setSize = (w, h) => {
    setValue("scalingFactor", "1.0");
    setOriginalImageWidth(w);
    setOriginalImageHeight(h);
    setValue("imageWidth", w);
    setValue("imageHeight", h);
  };

  const checkImageSize = (file, setSize) => {
    //check whether browser fully supports all File API
    if (
      file &&
      window.File &&
      window.FileReader &&
      window.FileList &&
      window.Blob
    ) {
      const fileReader = new FileReader();
      fileReader.onloadend = function () {
        // file is loaded
        const img = new Image();
        img.onload = function () {
          // image is loaded; sizes are available
          setSize(img.width || 0, img.height || 0);
        };
        img.src = fileReader.result; // is the data URL because called with readAsDataURL
      };
      fileReader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (imageAttachment) {
      checkImageSize(imageAttachment, setSize);
    }
     
  }, [imageAttachment]);

  const scalingFactorIsValid = (value) => {
    return parseFloat(value) > 0 && parseFloat(value) <= 1;
  };

  const dimensionIsValid = (value) => {
    return parseInt(value, 10) > 0;
  };

  useEffect(() => {
    const newImageWidth = Math.round(scalingFactor * originalImageWidth);
    const newImageHeight = Math.round(scalingFactor * originalImageHeight);
    setValue("imageWidth", newImageWidth);
    setValue("imageHeight", newImageHeight);
     
  }, [scalingFactor]);

  const handleClose = () => {
    setShowEmbedImageDialog(false);
    setImageAttachment(null);
    setInitialImage(null);
    setOriginalImageHeight(0);
    setOriginalImageWidth(0);
    resetForm();
  };

  const handleSubmit = () => {
    addEmbeddedImage(
      imageAttachment,
      getValues("imageWidth"),
      getValues("imageHeight")
    );
    handleClose();
  };

  return (
    <Modal
      open={showEmbedImageDialog}
      onClose={handleClose}
      title="Add Embedded Image"
      content={
        <Stack
          component="form"
          onSubmit={handleSubmit}
          gap={2}
        >
          {imageAttachment ? (
            <ImageList cols={1}>
              <ImageListItem key={imageAttachment.name}>
                <img
                  src={URL.createObjectURL(imageAttachment)}
                  alt={`preview of ${imageAttachment.name}`}
                />
              </ImageListItem>
            </ImageList>
          ) : (
            <DroppableFileUploadInput
              onFileChanged={onFileChanged}
              id="embed-image-upload"
              dragLabel="Drag Image Here"
              browseLabel="Choose an Image or"
              maxFileSizeMb={maxFileSizeMb}
            />
          )}
          <TextInput
            name="scalingFactor"
            label="Scaling Factor"
            control={control}
            defaultValue="1.0"
            rules={{
              validate: {
                isCorrectRange: (val) =>
                  scalingFactorIsValid(val) ||
                  "Scaling factor must be between 0 and 1"
              }
            }}
          />
          <TextInput
            name="imageWidth"
            label="Width"
            control={control}
            defaultValue="0.0"
            rules={{
              validate: {
                isPositive: (val) =>
                  dimensionIsValid(val) || "Width must be a positive number"
              }
            }}
          />
          <TextInput
            name="imageHeight"
            label="Height"
            control={control}
            defaultValue="0.0"
            rules={{
              validate: {
                isPositive: (val) =>
                  dimensionIsValid(val) || "Height must be a positive number"
              }
            }}
          />
        </Stack>
      }
      actions={
        <>
          <Button
            variant="outlined"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            disabled={imageAttachment === null}
            onClick={handleSubmit}
          >
            Confirm Embed
          </Button>
        </>
      }
    />
  );
};

export default EmbedImageDialog;
