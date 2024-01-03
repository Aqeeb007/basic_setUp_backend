import { Router } from 'express';
import {
  create_asset,
  delete_assets_by_id,
  get_assets,
  get_assets_by_id,
  get_inbox_data,
  update_asset,
  update_asset_status,
} from '../controllers/asset.controller.js';
import { verifyJWT } from '../middleware/auth.js';

const router = Router();

router.route('/create-asset').post(create_asset);
router.route('/assets').get(get_assets);
router.route('/inbox').get(get_inbox_data);
router.route('/inbox/:id').put(update_asset_status);

router.route('/update-asset/:assetId').put(update_asset);
router.route('/get-asset-by-id/:assetId').get(get_assets_by_id);

router
  .route('/delete-asset-by-id/:assetId')
  .delete(verifyJWT, delete_assets_by_id);

export default router;
