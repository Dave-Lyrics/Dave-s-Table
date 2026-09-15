import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const blank = {
  name: "",
  description: "",
  price: "",
  category: "Main",
  availability: true,
  image: ""
};

export default function MenuManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  async function load() {
    try {
      const r = await api.get("/menu");
      setItems(r.data.data);
    } catch (e) {
      setError(
        e.response?.data?.message || "Could not load menu items"
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  function edit(item) {
    setEditing(item._id);

    setForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      category: item.category || "Main",
      availability: item.availability ?? true,
      image: item.image || ""
    });

    setImageFile(null);
    setImagePreview(item.image || "");
    setError("");
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setError("");

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview("");

    setForm((prev) => ({
      ...prev,
      image: ""
    }));
  }

  function resetForm() {
    setEditing(null);
    setForm(blank);
    setImageFile(null);
    setImagePreview("");
    setError("");
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("category", form.category);
      data.append("availability", form.availability);

      /*
        If a new image was selected, send the actual file.
        The backend will upload it to Cloudinary.
      */
      if (imageFile) {
        data.append("image", imageFile);
      } else if (form.image) {
        /*
          When editing an item without selecting a new image,
          keep the existing Cloudinary URL.
        */
        data.append("image", form.image);
      }

      if (editing) {
        await api.put(`/menu/${editing}`, data);
      } else {
        await api.post("/menu", data);
      }

      resetForm();
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message || "Could not save menu item"
      );
    }
  }

  async function remove(id) {
    if (!confirm("Delete this menu item?")) return;

    try {
      await api.delete(`/menu/${id}`);
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message || "Could not delete menu item"
      );
    }
  }

  async function toggle(id) {
    try {
      await api.patch(`/menu/${id}/toggle`);
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message || "Could not update availability"
      );
    }
  }

  return (
    <main className="admin-content">
      <div className="admin-head">
        <div>
          <span className="eyebrow">MENU MANAGEMENT</span>

          <h1>
            {editing ? "Edit menu item" : "Add menu item"}
          </h1>
        </div>

        <Link className="secondary-btn" to="/admin">
          ← Dashboard
        </Link>
      </div>

      <form
        className="menu-form form-card"
        onSubmit={submit}
      >
        <div className="form-row">
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />
          </label>

          <label>
            Category
            <input
              required
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value
                })
              }
            />
          </label>

          <label>
            Price
            <input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value
                })
              }
            />
          </label>
        </div>

        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value
              })
            }
          />
        </label>

        {/* CUSTOM STYLED IMAGE UPLOAD SECTION */}
        <div className="image-upload-section">
          <label className="field-label">Menu Image</label>

          <label htmlFor="file-upload" className="custom-file-upload">
            <svg
              className="upload-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <span className="upload-text">
              <strong>Click to upload</strong> or drag and drop image here
            </span>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          {imagePreview && (
            <div className="image-preview-wrapper">
              <img
                src={imagePreview}
                alt="Menu preview"
                className="menu-image-preview"
              />
              <button
                type="button"
                className="secondary-btn"
                onClick={removeImage}
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <div className="head-actions">
          <button
            type="submit"
            className="primary-btn"
          >
            {editing ? "Save changes" : "Add item"}
          </button>

          {editing && (
            <button
              type="button"
              className="secondary-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="menu-admin-grid">
        {items.map((item) => (
          <article
            className="admin-menu-card"
            key={item._id}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
              />
            ) : (
              <div className="image-placeholder">
                DT
              </div>
            )}

            <div>
              <span className="pill">
                {item.category}
              </span>

              <h3>
                {item.name}
              </h3>

              <p>
                {item.description}
              </p>

              <b>
                ₦{item.price.toLocaleString()}
              </b>
            </div>

            <div className="card-actions">
              <button
                onClick={() => toggle(item._id)}
              >
                {item.availability
                  ? "Available"
                  : "Unavailable"}
              </button>

              <button
                onClick={() => edit(item)}
              >
                Edit
              </button>

              <button
                className="danger-link"
                onClick={() => remove(item._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}