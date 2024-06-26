import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import StyledTextfield from "../../ui/styledTextfield";
import StyledSelectField from "../../ui/styledSelectField";
import { getCategory } from "../../services/category";
import { formatDate } from "../../utils/dateFormat";
import { addLoyalityCard, updateLoyalityCard } from "../../services/loyaltyCard";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { getBrand } from "../../services/brands";
import FileUpload from "../../utils/FileUpload";
import { uploadFile } from "../../services/upload";
import { criteria } from "../../assets/json/criteria";

export default function AddLoyalty({ open, onClose, isUpdate, loyalityData, isSubmitted }) {
  const [selectedFile, setSelectedFile] = useState();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    getCategory().then((res) => {
      if (res.status) {
        setCategories(res.result.map((item) => ({ label: item.title, value: item._id })));
      }
    });

    getBrand().then((res) => {
      if (res.status) {
        setBrands(res.result.map((item) => ({ label: item.title, value: item._id })));
      }
    });
  }, []);

  const { control, handleSubmit, setError, reset, formState: { errors } } = useForm();

  useEffect(() => {
    reset({
      title: isUpdate ? loyalityData["title"] : "",
      description: isUpdate ? loyalityData["description"] : "",
      brand: isUpdate ? loyalityData["brand"] : "",
      OTP: isUpdate ? loyalityData["OTP"] : "",
      coin_cost: isUpdate ? loyalityData["coin_cost"] : "",
      coin_worth: isUpdate ? loyalityData["coin_worth"] : "",
      starts_from: isUpdate && loyalityData["starts_from"] ? dayjs(loyalityData["starts_from"]) : null,
      expiry: isUpdate && loyalityData["expiry"] ? dayjs(loyalityData["expiry"]) : null,
      no_of_cards: isUpdate ? loyalityData["no_of_cards"] : "",
      category: isUpdate ? loyalityData["category"] : "",
      availability_criteria: isUpdate ? loyalityData["availability_criteria"] : "",
    });
  }, [open]);

  const onSubmit = async (data) => {
    if (selectedFile) {
      const url = await uploadFile(selectedFile);
      data.image = url.data[0].url;
    }
    if (isUpdate) {
      editCard(data);
    } else {
      if (!selectedFile) {
        setError("file", { type: "manual", message: "Select image for Offer" });
        return;
      }
      addCard({ ...data });
    }
  };

  const addCard = ({ category, brand, expiry, starts_from, availability_criteria, ...data }) => {
    let dt = {
      category: category.value,
      brand: brand.value,
      expiry: formatDate(expiry),
      starts_from: formatDate(starts_from),
      availability_criteria: availability_criteria.value,
      ...data,
    };
    addLoyalityCard(dt)
      .then((res) => {
        if (res.status) {
          toast.success("Successfully added");
          isSubmitted();
          onClose();
        }
      })
      .catch((error) => {
        toast.error(error.response.message);
      });
  };

  const editCard = ({ category, brand, expiry, status, starts_from, availability_criteria, ...data }) => {
    let dt = {
      category: category.value,
      brand: brand.value,
      expiry: formatDate(expiry),
      starts_from: formatDate(starts_from),
      availability_criteria: availability_criteria.value,
      status: status ? "active" : "inactive",
      ...data,
    };
    updateLoyalityCard(loyalityData._id, dt)
      .then((res) => {
        if (res.status) {
          toast.success("Successfully Updated");
          isSubmitted();
          onClose();
        }
      })
      .catch((error) => {
        toast.error(error.response.message);
      });
  };

  const dialogClose = () => {
    reset({});
    onClose();
  };

  const onFileChange = (e) => {
    setSelectedFile(e.files[0]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} maxWidth="sm" fullWidth>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} p={2}>
          <Typography variant="subtitle1" sx={{ color: "primary.dark", fontWeight: 600 }}>
            {isUpdate ? "Edit" : "Add"} Loyalty card
          </Typography>
          <IconButton onClick={dialogClose}>
            <Close />
          </IconButton>
        </Stack>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Stack p={2} spacing={2}>
            <FileUpload onFileSelect={onFileChange} image={isUpdate ? loyalityData["image"] : null} />
            {errors.file && <span style={errorMsgStyle}>{errors.file.message}</span>}
            <Stack>
              <Typography variant="subtitle2">Loyalty Card Name</Typography>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <>
                    <StyledTextfield placeholder="Enter loyalty name" {...field} />
                    {errors.title && <span style={errorMsgStyle}>{errors.title.message}</span>}
                  </>
                )}
                rules={{ required: "Enter loyalty name" }}
              />
            </Stack>
            <Stack>
              <Typography variant="subtitle2">Description</Typography>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <>
                    <StyledTextfield placeholder="Enter description" {...field} />
                    {errors.description && <span style={errorMsgStyle}>{errors.description.message}</span>}
                  </>
                )}
                rules={{ required: "Enter description" }}
              />
            </Stack>
            <Stack direction={"column"}>
              <Typography variant="subtitle2">Brand</Typography>
              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <>
                    <StyledSelectField options={brands} placeholder={"select Brand"} {...field} />
                    {errors.brand && <span style={errorMsgStyle}>{errors.brand.message}</span>}
                  </>
                )}
                rules={{ required: "select brand" }}
              />
            </Stack>
            <Stack>
              <Stack direction={"row"} spacing={0.5}>
                <Stack flexGrow={1}>
                  <Typography variant="subtitle2">OTP</Typography>
                  <Controller
                    name="OTP"
                    control={control}
                    render={({ field }) => (
                      <StyledTextfield placeholder="Enter otp code" {...field} sx={{ flexGrow: 1 }} />
                    )}
                    rules={{ required: "Enter 4 digit vendor code" }}
                  />
                  {errors.OTP && <span style={errorMsgStyle}>{errors.OTP.message}</span>}
                </Stack>
                <Stack flexGrow={1}>
                  <Typography variant="subtitle2">Coins</Typography>
                  <Controller
                    name="coin_cost"
                    control={control}
                    render={({ field }) => (
                      <StyledTextfield placeholder="Enter coins" {...field} sx={{ flexGrow: 1 }} />
                    )}
                    rules={{ required: "Enter cost" }}
                  />
                  {errors.coin_cost && <span style={errorMsgStyle}>{errors.coin_cost.message}</span>}
                </Stack>
                <Stack flexGrow={1}>
                  <Typography variant="subtitle2">Currency Worth</Typography>
                  <Controller
                    name="coin_worth"
                    control={control}
                    render={({ field }) => (
                      <StyledTextfield placeholder="Enter worth" {...field} sx={{ flexGrow: 1 }} rightIcon={"OMR"} />
                    )}
                    rules={{ required: "Enter worth" }}
                  />
                  {errors.coin_worth && <span style={errorMsgStyle}>{errors.coin_worth.message}</span>}
                </Stack>
              </Stack>
            </Stack>
            <Stack direction={"row"} spacing={1}>
              <Stack flexGrow={1}>
                <Typography variant="subtitle2">Starts from</Typography>
                <Controller
                  name="starts_from"
                  control={control}
                  render={({ field }) => (
                    <>
                      <DatePicker format="MM/DD/YYYY" {...field} sx={{ height: "40px" }} slotProps={{ textField: { size: "small" } }} />
                      {errors.starts_from && <span style={errorMsgStyle}>{errors.starts_from.message}</span>}
                    </>
                  )}
                  rules={{ required: "Enter Offer starts date" }}
                />
              </Stack>
              <Stack flexGrow={1}>
                <Typography variant="subtitle2">Ends On</Typography>
                <Controller
                  name="expiry"
                  control={control}
                  render={({ field }) => (
                    <>
                      <DatePicker format="MM/DD/YYYY" {...field} sx={{ height: "40px" }} slotProps={{ textField: { size: "small" } }} />
                      {errors.expiry && <span style={errorMsgStyle}>{errors.expiry.message}</span>}
                    </>
                  )}
                  rules={{ required: "Select Date" }}
                />
              </Stack>
            </Stack>
            <Stack direction={"row"} spacing={1}>
              <Stack flexGrow={1}>
                <Typography variant="subtitle2">Category</Typography>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <>
                      <StyledSelectField options={categories} placeholder={"Select Category"} {...field} />
                      {errors.category && <span style={errorMsgStyle}>{errors.category.message}</span>}
                    </>
                  )}
                  rules={{ required: "Select category" }}
                />
              </Stack>
              <Stack flexGrow={1}>
                <Typography variant="subtitle2">Availability criteria</Typography>
                <Controller
                  name="availability_criteria"
                  control={control}
                  render={({ field }) => (
                    <>
                      <StyledSelectField options={criteria} placeholder={"Select Criteria"} {...field} />
                      {errors.availability_criteria && <span style={errorMsgStyle}>{errors.availability_criteria.message}</span>}
                    </>
                  )}
                  rules={{ required: "Select criteria" }}
                />
              </Stack>
            </Stack>
          </Stack>
          {isUpdate && (
            <Stack direction={"row"} justifyContent={"end"}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel control={<Switch defaultChecked={loyalityData["Status"] === "active"} />} label="Status" {...field} />
                )}
              />
            </Stack>
          )}
          <Stack direction={"row"} justifyContent={"end"} p={2} spacing={2}>
            <Button variant="outlined" sx={{ borderColor: "#777", color: "#777" }} onClick={dialogClose}>
              Cancel
            </Button>
            <Button variant="outlined" type="submit">
              {isUpdate ? "Update" : "Add"}
            </Button>
          </Stack>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}

const errorMsgStyle = {
  color: "red",
  fontSize: "12px",
  marginTop: "5px",
};
