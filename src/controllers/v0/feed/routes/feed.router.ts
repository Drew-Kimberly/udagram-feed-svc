import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import * as AWS from '../../../../aws';
import { requireAuth, UdagramJWT } from '@drewkimberly/udagram-auth';
import { config } from '../../../../config/config';

const router: Router = Router();
const authMiddleware = requireAuth(new UdagramJWT(config.jwt.secret));

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
  const items = await FeedItem.findAndCountAll({ order: [['id', 'DESC']] });
  items.rows.map(item => {
    if (item.url) {
      item.url = AWS.getGetSignedUrl(item.url);
    }
  });
  res.send(items);
});

// Get a feed by ID
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).send({ message: 'ID is required' });
  }

  if (!Number.isInteger(id)) {
    return res.status(400).send({ message: 'ID must be a valid integer' });
  }

  const item = await FeedItem.findByPk(id);

  if (!item) {
    return res.status(404).send({ message: `No feed found with ID: ${id}` });
  }

  if (item.url) {
    item.url = AWS.getGetSignedUrl(item.url);
  }
  res.send(item);
});

// update a specific resource
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const values: FeedItem = req.body;

  if (!id) {
    return res.status(400).send({ message: 'ID is required' });
  }

  if (!Number.isInteger(id)) {
    return res.status(400).send({ message: 'ID must be a valid integer' });
  }

  if (!values.caption) {
    return res
      .status(400)
      .send({ message: 'Caption is required or malformed' });
  }

  if (!values.url) {
    return res.status(400).send({ message: 'File url is required' });
  }

  try {
    const [, [updatedItem]] = await FeedItem.update(values, {
      returning: true,
      where: { id: id }
    });
    if (!updatedItem) {
      return res
        .status(404)
        .send({ message: `Unable to find Feed Item with ID: ${id}` });
    }
    updatedItem.url = AWS.getGetSignedUrl(updatedItem.url);
    res.send(updatedItem);
  } catch (e) {
    return res
      .status(500)
      .send({ message: `An unhandled error occurred: ${e.message}` });
  }
});

// Get a signed url to put a new item in the bucket
router.get(
  '/signed-url/:fileName',
  authMiddleware,
  async (req: Request, res: Response) => {
    const { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({ url: url });
  }
);

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const caption = req.body.caption;
  const fileName = req.body.url;

  // check Caption is valid
  if (!caption) {
    return res
      .status(400)
      .send({ message: 'Caption is required or malformed' });
  }

  // check Filename is valid
  if (!fileName) {
    return res.status(400).send({ message: 'File url is required' });
  }

  const item = await new FeedItem({
    caption: caption,
    url: fileName
  });

  const saved_item = await item.save();

  saved_item.url = AWS.getGetSignedUrl(saved_item.url);
  res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;
