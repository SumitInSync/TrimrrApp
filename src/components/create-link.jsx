import React, { useEffect, useRef, useState } from "react";
import { UrlState } from "../context";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Error from "./ui/error";
import { Card } from "./ui/card";
import * as yup from "yup";
import { QRCode } from "react-qrcode-logo";
import useFetch from "../hooks/use-ftech";
import { BeatLoader } from "react-spinners";
import {createUrl} from "@/db/apiUrls";

function CreateLink() {
  const { user } = UrlState();
  const ref = useRef();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup.string().url("Must be a valid URL").required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, {...formValues, user_id: user.id});

  
  useEffect(() => {
    if(error === null && data){
        navigate(`/link/${data[0].id}`);
    }
  },[error,data]);

  


   const createNewLink = async () => {
        setErrors([]);
        try {
            await schema.validate(formValues, {abortEarly: false});
      
            const canvas = ref.current.canvasRef.current;
            const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      
            await fnCreateUrl(blob);
          } catch (e) {
            const newErrors = {};
      
            e?.inner?.forEach((err) => {
              newErrors[err.path] = err.message;
            });
      
            setErrors(newErrors);
          }
   }





//   const handleValidation = async () => {
//     try {
//       await schema.validate(formValues, { abortEarly: false });
//       setErrors({});
//     } catch (err) {
//       const validationErrors = {};
//       err.inner.forEach((e) => {
//         validationErrors[e.path] = e.message;
//       });
//       setErrors(validationErrors);
//     }
//   };

  return (
    <Dialog
      defaultOpen={!!longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>
        {formValues?.longUrl && <QRCode value={formValues?.longUrl} size={250} ref={ref} />}
        <Input
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && <Error message={errors.title} />}

        <Input
          id="longUrl"
          placeholder="Enter your Loooong URL"
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && <Error message={errors.longUrl} />}

        <div className="flex items-center gap-2">
          <Card className="p-2">trimrr.in</Card>/
          <Input
            id="customUrl"
            placeholder="Custom Link (Optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>
        {error && <Error message={error.message} />}

        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="destructive" onClick={createNewLink} disabled = {loading}>
            {loading ? <BeatLoader size={10} color="white"/> : "Create Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLink;
