import db from '../DB/index.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import sendMail from '../utils/sendEmail.js';

//create a new asset
export const create_asset = asyncHandler(async (req, res) => {
  const {
    vendorName,
    status,
    thirdPartyName,
    assetDescription,
    assetCode,
    capacity,
    uom,
    inOutWarranty,
    assetAllocationDate,
    statusId,
    category,
    isActive,
    latLong,
    remarks,
    securityDeposit,
    agreementDetails,
    dispatchDate,
    purchaseCost,
    leaseControlNo,
    leaseControlStartDate,
    leaseControlEndDate,
    leaseBasicPrice,
    gstPer,
    leasePaymentAmount,
    leaseScheduleMonths,
  } = req.body;

  // const createdBy = req.user;

  const fieldsToCheck = [
    vendorName,
    thirdPartyName,
    assetDescription,
    assetCode,
    purchaseCost,
    capacity,
    uom,
    inOutWarranty,
    assetAllocationDate,
    statusId,
    category,
    isActive,
    latLong,
    remarks,
    securityDeposit,
    agreementDetails,
    dispatchDate,
    leaseControlNo,
    leaseControlStartDate,
    leaseControlEndDate,
    leaseBasicPrice,
    gstPer,
    leasePaymentAmount,
    leaseScheduleMonths,
  ];

  // if (fieldsToCheck.some((field) => !field || field.trim() === '')) {
  //   throw new ApiError(400, 'All fields are required');
  // }

  const asset = await db.asset.create({
    data: {
      vendorName,
      thirdPartyName,
      assetDescription,
      assetCode,
      purchaseCost,
      capacity,
      uom,
      inOutWarranty,
      assetAllocationDate,
      statusId,
      status,
      category,
      isActive,
      latLong,
      remarks,
      securityDeposit,
      agreementDetails,
      dispatchDate,
      leaseControlNo,
      leaseControlStartDate,
      leaseControlEndDate,
      leaseBasicPrice,
      gstPer,
      leasePaymentAmount,
      leaseScheduleMonths,
    },
  });

  if (!asset) {
    throw new ApiError(500, 'Something went wrong while creating the asset');
  }

  const url = `http:localhost:5174/inbox/${13465978}`;

  try {
    const emailMessage = `message`;

    await sendMail({
      email: 'aquebmohammad@gmail.com',
      subject: 'You have a new asset request',
      message: emailMessage,
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }

  return res
    .status(201)
    .json(new ApiResponse(200, asset, 'Asset added Successfully'));
});

// get assets
export const get_assets = asyncHandler(async (req, res) => {
  const assets = await db.asset.findMany();

  if (!assets) {
    throw new ApiError(500, 'Something went wrong');
  }

  return res.status(201).json(new ApiResponse(200, assets));
});

// get assets
export const get_inbox_data = asyncHandler(async (req, res) => {
  const assets = await db.asset.findMany({
    where: {
      status: { equals: 'PENDING' },
    },
  });

  if (!assets) {
    throw new ApiError(500, 'Something went wrong');
  }

  return res.status(201).json(new ApiResponse(200, assets));
});

// get update asset status
export const update_asset_status = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const assets = await db.asset.findUnique({
    where: {
      id,
    },
  });
  console.log('assets: ', assets);

  if (!assets) {
    throw new ApiError(500, 'Something went wrong');
  }

  const updatedData = await db.asset.update({
    where: {
      id,
    },
    data: {
      status: 'APPROVED',
    },
  });
  return res.status(201).json(new ApiResponse(200, updatedData));
});

//update assets
export const update_asset = asyncHandler(async (req, res) => {
  const id = req.params.assetId;

  const updatedAsset = await db.asset.update({
    where: { id },
    data: req.body,
  });

  if (!updatedAsset) {
    throw new ApiError(500, 'Something went wrong while updating the asset');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAsset, 'Asset updated successfully'));
});

//get by id
export const get_assets_by_id = asyncHandler(async (req, res) => {
  const id = req.params.assetId;
  const asset = await db.asset.findUnique({
    where: { id },
  });

  if (!asset) {
    throw new ApiError(500, 'Something went wrong');
  }

  return res.status(201).json(new ApiResponse(200, asset));
});

//delete by id
export const delete_assets_by_id = asyncHandler(async (req, res) => {
  const id = req.params.assetId;

  const asset = await db.asset.findUnique({
    where: { id },
  });

  if (!asset) {
    throw new ApiError(500, 'Something went wrong');
  }
  await db.asset.delete({
    where: { id },
  });

  return res.status(201).json(new ApiResponse(200, asset));
});
