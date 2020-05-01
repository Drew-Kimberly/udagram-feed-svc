# Udagram Feed API
An ExpressJS API service for Udagram Feeds.

_This packaged is maintained via the [Udagram Monorepo](https://github.com/Drew-Kimberly/Udagram)_

## Feed API Usage
Current API Version: `v0`.

Interface definitions:
```typescript
interface FeedItem {
  id: number;
  caption: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

interface FeedItemCollection {
  count: number;
  rows: FeedItem[];
}

type CreateFeedItemRequestBody = Omit<FeedItem, 'id' | 'createdAt' | 'updatedAt'>;
type UpdaterFeedItemRequestBody = Omit<FeedItem, 'createdAt' | 'updatedAt'>;
```

### Public

#### `GET /api/{version}/feed`
Returns all created feed items.
##### Parameters
`version` - The Feed API version.
##### Available Query Parameters
None
##### Request Body
None
##### Returns
A `FeedItemCollection`.

#### `GET /api/{version}/feed/{id}`
Gets a specific feed item by ID.
##### Parameters
`version` - The Feed API version.

`id` - The ID of the Feed item to retrieve.
##### Available Query Parameters
None
##### Request Body
None
##### Returns
A `FeedItem` object.

### Private
These requests require a valid JWT in the `Authorization` request header.
See [udagram-auth](https://github.com/Drew-Kimberly/udagram-auth)

#### `POST /api/{version}/feed`
Creates a new feed item.
##### Parameters
`version` - The Feed API version.
##### Available Query Parameters
None
##### Request Body
A JSON representation of `CreateFeedItemRequestBody`.
##### Returns
The created `FeedItem`.

#### `PUT /api/{version}/feed/{id}`
Updates an existing FeedItem.
##### Parameters
`version` - The Feed API version.
`id` - The ID of the feed item.
##### Available Query Parameters
None
##### Request Body
A JSON representation of `UpdateFeedItemRequestBody`.
##### Returns
The created `FeedItem`.
