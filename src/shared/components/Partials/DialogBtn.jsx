  import React, { useState } from "react";
  import { PlusIcon } from "@heroicons/react/24/outline";
  import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Tooltip,
    Card,
    Typography,
    Input,
  } from "@material-tailwind/react";
  import axios from "axios";
  import { userApi } from "../../../config/axios";
  import { useNavigate } from "react-router-dom";

  const DialogBtn = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      address: "",
      petName: "",
      contact: "",
      petBirthdate: "",
      petDeathdate: "",
      deathCause: "",
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [recommendedBurialDate, setRecommendedBurialDate] = useState();
    const navigate = useNavigate();

    const handleOpen = () => setOpen(!open);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Trigger burial date recommendation when death date changes
      if (name === "petDeathdate") {
        recommendBurialDate(value);
      }
    };

    const recommendBurialDate = async (deathDate) => {
      try {
        const response = await axios.post("http://127.0.0.1:5000/predict", {
          deathDate,
        });
        if (response.data) {
          setRecommendedBurialDate(response.data); // Set the recommended burial date
          console.log("Response Data:", response.data); // Log the response data
        }
      } catch (err) {
        // Check if error has a response and capture the error message
        if (err.response && err.response.data) {
          const errorMessage = err.response.data.error || "An unknown error occurred.";
          console.error("Error Message:", errorMessage); // Log the error message
          setRecommendedBurialDate({ error: errorMessage }); // Optionally set the error in state
        } else {
          console.error("Unexpected Error:", err); // Log unexpected errors
        }
      }
    };
    

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrors({});
      setSuccessMessage("");

      // Simple validation
      const validationErrors = {};
      if (!formData.name) validationErrors.name = "Name of Owner is required.";
      if (!formData.address) validationErrors.address = "Address is required.";
      if (!formData.petName) validationErrors.petName = "Name of Pet is required.";
      if (!formData.contact) validationErrors.contact = "Contact Number is required.";
      if (!formData.petBirthdate) validationErrors.petBirthdate = "Pet Birthdate is required.";
      if (!formData.petDeathdate) validationErrors.petDeathdate = "Pet Deathdate is required.";
      if (!formData.deathCause) validationErrors.deathCause = "Pet Cause of Death is required.";

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      try {
        const submissionData = {
          ...formData,
          recommendedBurialDate: recommendedBurialDate?.burialDate || null
        };
    
        const response = await userApi.post("/appointment", submissionData);
    
        if (response) {
          navigate(0);
        }
      } catch (error) {
        setErrors({ api: "Failed to add appointment. Please try again later." });
      }
    };

    return (
      <>
        <Tooltip content="Edit Schedule">
          <Button
            onClick={handleOpen}
            variant="gradient"
            className="flex items-center mx-2 bg-black border border-black"
            color="yellow"
          >
            <PlusIcon className="w-5 h-5" />
            Add Schedule
          </Button>
        </Tooltip>

        <Dialog open={open} handler={handleOpen} className="max-h-screen">
          <form onSubmit={handleSubmit} className="p-5">
            <DialogHeader className="flex justify-center">
              Add New Schedule
            </DialogHeader>
            <DialogBody className="overflow-y-scroll max-h-[400px]">
              <Card color="transparent" shadow={false} className="mx-auto rounded-2xl">
                <div className="flex flex-col">
                  {/* Name of Owner Section */}
                  <Typography variant="h6" color="blue-gray">
                    Name of Owner
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="e.g. Juan Dela Cruz"
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                  {/* Address Section */}
                  <Typography variant="h6" color="blue-gray" className="mt-4">
                    Address
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="e.g. 63 Bantayog St. Concepcion Uno MC"
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

                  {/* Name of Pet Section */}
                  <Typography variant="h6" color="blue-gray" className="mt-4">
                    Name of Pet
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="e.g. Brownie"
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                  />
                  {errors.petName && <p className="text-red-500 text-sm">{errors.petName}</p>}

                  {/* Contact Number Section */}
                  <Typography variant="h6" color="blue-gray" className="mt-4">
                    Contact Number
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="e.g. 0912345678"
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                  />
                  {errors.contact && (
                    <p className="text-red-500 text-sm">{errors.contact}</p>
                  )}

                  {/* Birthday of Pet Section */}
                  <Typography variant="h6" color="blue-gray" className="mt-4">
                    Birthday of Pet
                  </Typography>
                  <Input
                    size="lg"
                    type="date"
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    name="petBirthdate"
                    value={formData.petBirthdate}
                    onChange={handleChange}
                  />
                  {errors.petBirthdate && (
                    <p className="text-red-500 text-sm">{errors.petBirthdate}</p>
                  )}

                  {/* Death Date Section */}
                  <Typography variant="h6" color="blue-gray" className="mt-4">
                    Death Date
                  </Typography>
                  <Input
                    size="lg"
                    type="date"
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    name="petDeathdate"
                    value={formData.petDeathdate}
                    onChange={handleChange}
                  />
                  {errors.petDeathdate && (
                    <p className="text-red-500 text-sm">{errors.petDeathdate}</p>
                  )}

                  {recommendedBurialDate && (
                    recommendedBurialDate.burialDate ? (
                      <div className="bg-green-100 text-green-600 flex gap-2 mt-2 px-2 py-1 rounded">
                        <p>Recommended Burial Date: {recommendedBurialDate?.burialDate}</p>
                        <p>{recommendedBurialDate?.burialWeekday}</p>
                      </div>
                    )
                    :
                    (
                      <div className="bg-red-100 text-red-600 flex gap-2 mt-2 px-2 py-1 rounded">
                        <p>{recommendedBurialDate?.error}</p>
                      </div>
                    )
                  )}

                  {/* Cause of Death Section */}
                  <Typography variant="h6" color="blue-gray" className="mt-4">
                    Cause of Death
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="e.g. Natural Causes"
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    name="deathCause"
                    value={formData.deathCause}
                    onChange={handleChange}
                  />
                  {errors.deathCause && (
                    <p className="text-red-500 text-sm">{errors.deathCause}</p>
                  )}
                </div>

                {errors.api && <p className="text-red-500 text-sm mt-4">{errors.api}</p>}
                {successMessage && (
                  <p className="text-green-500 text-sm mt-4">{successMessage}</p>
                )}
              </Card>
            </DialogBody>
            <DialogFooter>
              <div className="flex gap-2 items-center justify-between w-full">
                <Button type="submit" variant="gradient" color="yellow">
                  Submit
                </Button>
                <Button variant="text" color="red" onClick={handleOpen}>
                  <span>Cancel</span>
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Dialog>
      </>
    );
  };

  export default DialogBtn;
