import MenuItem from "../models/MenuItem.js";
import cloudinary from "../config/cloudinary.js";

export async function getMenu(req, res) {
  const filter = {};
  if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
  res.json({ data: await MenuItem.find(filter).sort({ createdAt: -1 }) });
}

export async function createMenu(req, res) {
  try {
    const { name, description, price, category, availability = true } = req.body;
    let image = req.body.image || "";
    if (req.file && process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "daves-table/menu" }, (err, data) => err ? reject(err) : resolve(data));
        stream.end(req.file.buffer);
      });
      image = result.secure_url;
    }
    const item = await MenuItem.create({ name, description, price, category, availability, image });
    res.status(201).json({ data: item });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function updateMenu(req, res) {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    const fields = ["name", "description", "price", "category", "availability", "image"];
    fields.forEach(k => { if (req.body[k] !== undefined) item[k] = req.body[k]; });
    if (req.file && process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "daves-table/menu" }, (err, data) => err ? reject(err) : resolve(data));
        stream.end(req.file.buffer);
      });
      item.image = result.secure_url;
    }
    await item.save();
    res.json({ data: item });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function deleteMenu(req, res) {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Menu item deleted" });
}

export async function toggleMenu(req, res) {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Menu item not found" });
  item.availability = !item.availability;
  await item.save();
  res.json({ data: item });
}