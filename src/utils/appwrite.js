import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('690ce2ca002fff7f5164');

const account = new Account(client);
const db = new Databases(client);
const storage = new Storage(client);

// ✅ Shared bucket and database
const SHARED_BUCKET = '690ceb4300336822a3cc';
const DB_ID = '690ceb7d0001bbaff55a';

const PRODUCTS_COLLECTION = 'products';
const BANNERS_COLLECTION = 'banners';

// 🔐 Auth
export async function login(email, password) {
  return await account.createEmailPasswordSession({ email, password });
}

export async function getSession() {
  try {
    return await account.getSession('current');
  } catch {
    return null;
  }
}

// 🛒 Products
export async function getProducts(category) {
  const filters = category ? [Query.equal('category', category)] : [];
  const res = await db.listDocuments(DB_ID, PRODUCTS_COLLECTION, filters);
  return res.documents.map((doc) => ({
    ...doc,
    image: doc.image
      ? storage.getFileView(SHARED_BUCKET, doc.image).toString()
      : null,
  }));
}

export async function getAllProducts() {
  return await getProducts();
}

export async function uploadProduct({ title, price, category, image }, { onProgress, onSuccess, onError } = {}) {
  try {
    const newId = ID.unique();
    const uploaded = await storage.createFile(SHARED_BUCKET, newId, image, onProgress);

    const doc = await db.createDocument(DB_ID, PRODUCTS_COLLECTION, newId, {
      name: title,
      price: parseFloat(price),
      category,
      image: uploaded.$id,
    });

    if (onSuccess) onSuccess(doc);
    return doc;
  } catch (err) {
    console.error('Product upload failed:', err);
    if (onError) onError(err);
    throw err;
  }
}

export async function deleteProduct(id) {
  return await db.deleteDocument(DB_ID, PRODUCTS_COLLECTION, id);
}

export async function updateProduct(id, updates) {
  try {
    return await db.updateDocument(DB_ID, PRODUCTS_COLLECTION, id, updates);
  } catch (err) {
    console.error('Update failed:', err);
    throw err;
  }
}

// 🖼️ Banners
export async function getBanners() {
  const res = await db.listDocuments(DB_ID, BANNERS_COLLECTION, [Query.orderAsc('priority')]);
  return res.documents.map((doc) => ({
    ...doc,
    image: doc.image
      ? storage.getFileView(SHARED_BUCKET, doc.image).toString()
      : null,
  }));
}

export async function uploadBanner({ title, subtitle, link, image, priority }, { onProgress, onSuccess, onError } = {}) {
  try {
    if (!title || title.trim() === '') {
      throw new Error('Banner title is required');
    }

    const newId = ID.unique();
    const uploaded = await storage.createFile(SHARED_BUCKET, newId, image, onProgress);

    const doc = await db.createDocument(DB_ID, BANNERS_COLLECTION, newId, {
      name: title,
      subtitle,
      link,
      image: uploaded.$id,
      priority,
    });

    if (onSuccess) onSuccess(doc);
    return doc;
  } catch (err) {
    console.error('Banner upload failed:', err);
    if (onError) onError(err);
    throw err;
  }
}

export async function deleteBanner(id) {
  return await db.deleteDocument(DB_ID, BANNERS_COLLECTION, id);
}

export async function updateBanner(id, updates) {
  return await db.updateDocument(DB_ID, BANNERS_COLLECTION, id, updates);
}

// 🔁 Export core instances
export {
  account,
  storage,
  ID,
  db,
  DB_ID,
  PRODUCTS_COLLECTION,
  BANNERS_COLLECTION,
  SHARED_BUCKET,
};