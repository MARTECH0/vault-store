'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, LogOut, Package, Search, Upload, X, ArrowUpDown, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  tag: string;
  image_url: string;
  description?: string;
  stock: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    tag: '',
    image_url: '',
    description: '',
    stock: '0',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // New features state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [sortField, setSortField] = useState<keyof Product>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    checkAuth();
    fetchProducts();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
    }
  }

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ title: '', price: '', category: '', tag: '', image_url: '', description: '', stock: '0' });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      category: product.category,
      tag: product.tag,
      image_url: product.image_url,
      description: product.description || '',
      stock: (product.stock ?? 0).toString(),
    });
    setImageFile(null);
    setImagePreview(product.image_url || null);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product', 'error');
    } else {
      showToast('Product deleted successfully');
      fetchProducts();
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading image:', error);
      showToast(`Image upload error: ${error.message}`, 'error');
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (JPG, PNG, WebP, etc.)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be smaller than 5MB', 'error');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = formData.image_url;

    // Upload new image if one was selected
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (!uploadedUrl) {
        showToast('Failed to upload image. Please try again.', 'error');
        setUploading(false);
        return;
      }
      imageUrl = uploadedUrl;
    }

    if (!imageUrl && !editingProduct) {
      showToast('Please select a product image.', 'error');
      setUploading(false);
      return;
    }

    const productData = {
      title: formData.title,
      price: parseFloat(formData.price),
      category: formData.category,
      tag: formData.tag,
      image_url: imageUrl,
      description: formData.description,
      stock: parseInt(formData.stock) || 0,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        console.error('Error updating product:', error);
        showToast('Failed to update product', 'error');
      } else {
        showToast('Product updated successfully');
        fetchProducts();
        setShowModal(false);
      }
    } else {
      const { error } = await supabase.from('products').insert(productData);

      if (error) {
        console.error('Error adding product:', error);
        showToast('Failed to add product', 'error');
      } else {
        showToast('Product added successfully');
        fetchProducts();
        setShowModal(false);
      }
    }
    setUploading(false);
  };

  // Filter and Sort logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || 
                          (activeFilter === 'Out of Stock' ? product.stock <= 0 : product.category === activeFilter);
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const uniqueCategories = ['All', 'Out of Stock', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-[#0B132B] text-gray-100 font-sans selection:bg-emerald-500/30 relative">
      {/* Toast Notification System */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header (Glassmorphism) */}
      <header className="sticky top-0 z-40 bg-[#0B132B]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-[#FFC800] bg-clip-text text-transparent">
                Vault Store
              </Link>
              <span className="text-white/20">|</span>
              <span className="text-gray-300 font-medium tracking-wide">Admin Dashboard</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Stats - Premium Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                  <Package className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Total Products</p>
                  <p className="text-3xl font-bold text-white mt-1">{products.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Categories</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {new Set(products.map(p => p.category)).size}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group md:col-span-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC800]/10 rounded-full blur-3xl group-hover:bg-[#FFC800]/20 transition-all"></div>
              <div className="relative z-10">
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-3">Inventory Health</p>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-sm text-gray-300">In Stock: {products.filter(p => (p.stock ?? 0) > 5).length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-sm text-gray-300">Low: {products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5).length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-sm text-gray-300">Out: {products.filter(p => (p.stock ?? 0) <= 0).length}</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
                  {products.length > 0 && (
                    <>
                      <div style={{ width: `${(products.filter(p => (p.stock ?? 0) > 5).length / products.length) * 100}%` }} className="h-full bg-emerald-500 transition-all duration-1000"></div>
                      <div style={{ width: `${(products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5).length / products.length) * 100}%` }} className="h-full bg-amber-500 transition-all duration-1000"></div>
                      <div style={{ width: `${(products.filter(p => (p.stock ?? 0) <= 0).length / products.length) * 100}%` }} className="h-full bg-red-500 transition-all duration-1000"></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions & Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <button
                onClick={handleAddProduct}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-gray-900 px-6 py-3 rounded-lg font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Add New Product
              </button>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeFilter === category
                      ? 'bg-emerald-500 text-gray-900 shadow-lg shadow-emerald-500/20'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Table */}
          {loading ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl overflow-hidden p-8 flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
              <p className="text-gray-400 font-medium">Fetching Vault Inventory...</p>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th 
                        className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors group"
                        onClick={() => handleSort('title')}
                      >
                        <div className="flex items-center gap-2">
                          Product
                          <ArrowUpDown className={`w-4 h-4 ${sortField === 'title' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors group"
                        onClick={() => handleSort('category')}
                      >
                        <div className="flex items-center gap-2">
                          Category
                          <ArrowUpDown className={`w-4 h-4 ${sortField === 'category' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Tag
                      </th>
                      <th 
                        className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors group"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center gap-2">
                          Price
                          <ArrowUpDown className={`w-4 h-4 ${sortField === 'price' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors group"
                        onClick={() => handleSort('stock')}
                      >
                        <div className="flex items-center gap-2">
                          Stock
                          <ArrowUpDown className={`w-4 h-4 ${sortField === 'stock' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                        </div>
                      </th>
                      <th className="px-6 py-5 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-white/5 transition-colors group/row">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={product.image_url}
                                alt={product.title}
                                className={`w-16 h-16 object-cover rounded-lg border border-white/10 ${(product.stock ?? 0) <= 0 ? 'grayscale opacity-50' : ''}`}
                              />
                              {(product.stock ?? 0) <= 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                                  <X className="w-6 h-6 text-red-500" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-white group-hover/row:text-emerald-400 transition-colors">{product.title}</p>
                              <p className="text-sm text-gray-500">ID: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gray-300 border border-white/5 capitalize shadow-inner">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
                            {product.tag}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-white">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {(() => {
                            const stock = product.stock ?? 0;
                            if (stock <= 0) {
                              return (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                  Out of Stock
                                </span>
                              );
                            }
                            if (stock <= 5) {
                              return (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Low: {stock}
                                </span>
                              );
                            }
                            return (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                In Stock: {stock}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                              title="Edit product"
                              aria-label="Edit product"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="Delete product"
                              aria-label="Delete product"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-lg font-bold text-white mb-1">No products found</p>
                  <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* Glassmorphism Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111A3A] border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative"
            >
              <div className="sticky top-0 z-10 bg-[#111A3A]/90 backdrop-blur-md p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Product Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Premium Wireless Headphones"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                    Price ($)
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="149.99"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#1A264D] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select category</option>
                      <option value="151">151</option>
                      <option value="Black Bolt">Black Bolt</option>
                      <option value="White Flare">White Flare</option>
                      <option value="Prismatic">Prismatic</option>
                      <option value="Stellar Crown">Stellar Crown</option>
                      <option value="Surging Sparks">Surging Sparks</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="tag" className="block text-sm font-medium text-gray-300 mb-2">
                      Tag
                    </label>
                    <select
                      id="tag"
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-[#1A264D] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select tag</option>
                      <option value="Bestseller">Bestseller</option>
                      <option value="New">New</option>
                      <option value="Rare">Rare</option>
                      <option value="Trending">Trending</option>
                      <option value="Popular">Popular</option>
                      <option value="Sale">Sale</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Image
                  </label>
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative mb-3 group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setFormData({ ...formData, image_url: '' });
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {/* Drop Zone */}
                  {!imagePreview && (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                    >
                      <Upload className="w-10 h-10 text-gray-500 group-hover:text-emerald-400 mx-auto mb-3 transition-colors" />
                      <p className="text-sm font-medium text-gray-300">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 5MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageSelect(file);
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none custom-scrollbar"
                    placeholder="Enter a detailed description of the product..."
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold transition-all border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                      uploading
                        ? 'bg-emerald-500/50 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-gray-900 shadow-emerald-500/20 active:scale-95'
                    }`}
                  >
                    {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {uploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
