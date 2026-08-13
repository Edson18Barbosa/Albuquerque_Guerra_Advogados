import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, X, Image as ImageIcon, Search, Filter, MoreVertical, Trash2, 
  Edit, Eye, Copy, Download, AlertTriangle, CheckCircle2, Info, RefreshCw, 
  Sliders, Maximize2, FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Define structures matching media_library table
interface MediaItem {
  id: string;
  file_name: string;
  display_name: string;
  storage_path: string;
  public_url: string;
  bucket_name: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  orientation?: 'horizontal' | 'vertical' | 'square';
  alt_text?: string;
  caption?: string;
  credits?: string;
  category?: string;
  tags?: string[];
  focal_x?: number;
  focal_y?: number;
  zoom?: number;
  created_at: string;
  updated_at: string;
  uploaded_by?: string;
  assigned_section?: string | null;
}

const LOCAL_STORAGE_KEY = 'albuquerque_guerra_media_library';

// Default seed items matching site resources
const defaultMediaItems: MediaItem[] = [
  { 
    id: 'media-1', 
    display_name: 'Escritório Fachada', 
    file_name: 'about-office.png', 
    public_url: '/about-office.png', 
    storage_path: 'site-media/about-office.png', 
    bucket_name: 'site-media',
    mime_type: 'image/png', 
    file_size: 482242, 
    width: 600, 
    height: 429, 
    orientation: 'horizontal', 
    alt_text: 'Escritório Fachada', 
    category: 'Ambiente', 
    tags: ['sede', 'recife'], 
    assigned_section: 'about_office',
    created_at: new Date('2026-07-22T21:00:00Z').toISOString(),
    updated_at: new Date('2026-07-22T21:00:00Z').toISOString()
  },
  { 
    id: 'media-2', 
    display_name: 'Sala de Reuniões', 
    file_name: 'meeting-room.jpg', 
    // Intentionally broken unsplash URL to trigger the "Imagem indisponível" error state
    public_url: 'https://images.unsplash.com/photo-1505664159854-broken-url-to-test?auto=format&fit=crop&w=800&q=80', 
    storage_path: 'site-media/meeting-room.jpg', 
    bucket_name: 'site-media',
    mime_type: 'image/jpeg', 
    file_size: 2400000, 
    width: 800, 
    height: 600, 
    orientation: 'horizontal', 
    alt_text: 'Sala de Reuniões do escritório', 
    category: 'Ambiente', 
    tags: ['reunião', 'escritório'], 
    assigned_section: 'gallery_2',
    created_at: new Date('2026-07-22T21:05:00Z').toISOString(),
    updated_at: new Date('2026-07-22T21:05:00Z').toISOString()
  },
  { 
    id: 'media-3', 
    display_name: 'Documentos', 
    file_name: 'documents.jpg', 
    public_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80', 
    storage_path: 'site-media/documents.jpg', 
    bucket_name: 'site-media',
    mime_type: 'image/jpeg', 
    file_size: 850000, 
    width: 800, 
    height: 600, 
    orientation: 'horizontal', 
    alt_text: 'Contrato e caneta para assinatura', 
    category: 'Atuação', 
    tags: ['contrato', 'civil'], 
    assigned_section: 'gallery_3',
    created_at: new Date('2026-07-22T21:10:00Z').toISOString(),
    updated_at: new Date('2026-07-22T21:10:00Z').toISOString()
  },
  { 
    id: 'media-4', 
    display_name: 'Tribunal', 
    file_name: 'courtroom.jpg', 
    public_url: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=800&q=80', 
    storage_path: 'site-media/courtroom.jpg', 
    bucket_name: 'site-media',
    mime_type: 'image/jpeg', 
    file_size: 3100000, 
    width: 800, 
    height: 600, 
    orientation: 'horizontal', 
    alt_text: 'Martelo da justiça e livros de direito', 
    category: 'Excelência', 
    tags: ['contencioso', 'justiça'], 
    assigned_section: 'gallery_4',
    created_at: new Date('2026-07-22T21:15:00Z').toISOString(),
    updated_at: new Date('2026-07-22T21:15:00Z').toISOString()
  },
  { 
    id: 'media-5', 
    display_name: 'Renata Albuquerque', 
    file_name: 'renata-albuquerque.jpg', 
    public_url: '/renata-albuquerque.jpg', 
    storage_path: 'site-media/renata-albuquerque.jpg', 
    bucket_name: 'site-media',
    mime_type: 'image/jpeg', 
    file_size: 103736, 
    width: 683, 
    height: 1024, 
    orientation: 'vertical', 
    alt_text: 'Renata Albuquerque', 
    category: 'Liderança', 
    tags: ['sócia', 'equipe'], 
    created_at: new Date('2026-07-22T21:20:00Z').toISOString(),
    updated_at: new Date('2026-07-22T21:20:00Z').toISOString()
  },
  { 
    id: 'media-6', 
    display_name: 'João Guerra', 
    file_name: 'joao-guerra.jpg', 
    public_url: '/joao-guerra.jpg', 
    storage_path: 'site-media/joao-guerra.jpg', 
    bucket_name: 'site-media',
    mime_type: 'image/jpeg', 
    file_size: 1600000, 
    width: 683, 
    height: 1024, 
    orientation: 'vertical', 
    alt_text: 'João Guerra', 
    category: 'Liderança', 
    tags: ['sócio', 'equipe'], 
    created_at: new Date('2026-07-22T21:25:00Z').toISOString(),
    updated_at: new Date('2026-07-22T21:25:00Z').toISOString()
  },
  { 
    id: 'media-7', 
    display_name: 'Cláudia Albuquerque', 
    file_name: 'claudia-albuquerque.jpg', 
    public_url: '/claudia-albuquerque.jpg', 
    storage_path: 'site-media/claudia-albuquerque.jpg', 
    bucket_name: 'site-media',
    mime_type: 'image/jpeg', 
    file_size: 94579, 
    width: 683, 
    height: 1024, 
    orientation: 'vertical', 
    alt_text: 'Cláudia Albuquerque', 
    category: 'Liderança', 
    tags: ['sócia', 'equipe'], 
    created_at: new Date('2026-07-22T21:30:00Z').toISOString(),
    updated_at: new Date('2026-07-22T21:30:00Z').toISOString()
  }
];

export const AdminMedia: React.FC = () => {
  // CRUD states
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info' | null, text: string }>({ type: null, text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filterFormat, setFilterFormat] = useState('Todos');
  const [filterOrientation, setFilterOrientation] = useState('Todos');
  const [filterUsage, setFilterUsage] = useState('Todos');
  const [filterError, setFilterError] = useState('Todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals & Popups
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReplaceOpen, setIsReplaceOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Selected item contexts
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // File Upload Form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({
    display_name: '',
    alt_text: '',
    caption: '',
    category: 'Ambiente',
    tags: '',
    credits: '',
    focal_x: 50,
    focal_y: 50,
    width: 0,
    height: 0,
    orientation: 'horizontal' as 'horizontal' | 'vertical' | 'square',
    mime_type: '',
    file_size: 0
  });

  // Edit/Replace Form state
  const [editForm, setEditForm] = useState({
    display_name: '',
    alt_text: '',
    caption: '',
    category: '',
    tags: '',
    credits: '',
    focal_x: 50,
    focal_y: 50,
    zoom: 1.0
  });
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replacePreview, setReplacePreview] = useState<string | null>(null);

  // Check where image is used in site
  const getImageUsage = (urlOrPath: string): string[] => {
    const usages: string[] = [];
    const cleanUrl = urlOrPath.split('?')[0].toLowerCase();
    
    if (cleanUrl.includes('logo-horizontal') || cleanUrl.includes('logo-vertical') || cleanUrl.includes('logo-monogram')) {
      usages.push('Logomarca do Site');
    }
    if (cleanUrl.includes('about-office') || cleanUrl.includes('photo-escritorio')) {
      usages.push('Seção Sobre o Escritório (Home)');
    }
    if (cleanUrl.includes('joao-guerra') || cleanUrl.includes('renata') || cleanUrl.includes('claudia') || cleanUrl.includes('photo-1573496359142') || cleanUrl.includes('photo-1560250097')) {
      usages.push('Sócios & Liderança (Equipe)');
    }
    if (cleanUrl.includes('gallery-founders') || cleanUrl.includes('photo-1505664159854') || cleanUrl.includes('photo-1450101499163') || cleanUrl.includes('photo-1589391886645')) {
      usages.push('Galeria Institucional');
    }
    if (cleanUrl.includes('event-innovation') || cleanUrl.includes('palestra-inovacao') || cleanUrl.includes('workshop') || cleanUrl.includes('congresso')) {
      usages.push('Eventos & Palestras');
    }
    return usages;
  };

  // Load items from Supabase or localStorage fallback
  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      // 1. Try Supabase query
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setMediaItems(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } else {
        // Table is empty, seed defaults
        setMediaItems(defaultMediaItems);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultMediaItems));
      }
    } catch (err: any) {
      console.warn('Supabase fetch failed, falling back to localStorage:', err.message);
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setMediaItems(JSON.parse(stored));
      } else {
        setMediaItems(defaultMediaItems);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultMediaItems));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Display status notifications briefly
  const showStatus = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg({ type: null, text: '' });
    }, 5000);
  };

  // Image upload handler
  const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showStatus('error', 'O arquivo excede o peso máximo de 5 MB.');
      return;
    }

    // Validate type
    const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif', 'image/svg+xml'];
    if (!acceptedTypes.includes(file.type)) {
      showStatus('error', 'Formato inválido. Aceito apenas PNG, JPG, WebP, AVIF e SVG.');
      return;
    }

    setUploadFile(file);

    // Read details & dimensions
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadPreview(result);

      // Create image object to read width/height
      const img = new Image();
      img.onload = () => {
        const orientation = img.width > img.height ? 'horizontal' : (img.width < img.height ? 'vertical' : 'square');
        setUploadForm(prev => ({
          ...prev,
          display_name: file.name.replace(/\.[^/.]+$/, ""),
          mime_type: file.type,
          file_size: file.size,
          width: img.width,
          height: img.height,
          orientation
        }));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadPreview) return;

    setIsSubmitting(true);
    try {
      const fileExt = uploadFile.name.split('.').pop();
      const storagePath = `public/media-${Date.now()}.${fileExt}`;
      let publicUrl = '';

      // 1. Try uploading to Supabase Storage
      try {
        const { error: uploadErr } = await supabase.storage
          .from('site-media')
          .upload(storagePath, uploadFile, { cacheControl: '3600', upsert: true });

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabase.storage
          .from('site-media')
          .getPublicUrl(storagePath);
        
        publicUrl = publicUrlData.publicUrl;
      } catch (storageErr) {
        console.warn('Storage upload failed, falling back to Base64 data URL:', storageErr);
        // Fallback to local Base64 URL so it still works on localhost
        publicUrl = uploadPreview;
      }

      // 2. Prepare database record
      const newRecord: MediaItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : `media-${Date.now()}`,
        file_name: uploadFile.name,
        display_name: uploadForm.display_name || uploadFile.name,
        storage_path: storagePath,
        public_url: publicUrl,
        bucket_name: 'site-media',
        mime_type: uploadForm.mime_type,
        file_size: uploadForm.file_size,
        width: uploadForm.width,
        height: uploadForm.height,
        orientation: uploadForm.orientation,
        alt_text: uploadForm.alt_text,
        caption: uploadForm.caption,
        credits: uploadForm.credits,
        category: uploadForm.category,
        tags: uploadForm.tags ? uploadForm.tags.split(',').map(t => t.trim()) : [],
        focal_x: uploadForm.focal_x,
        focal_y: uploadForm.focal_y,
        zoom: 1.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // 3. Try to save to Supabase Database
      try {
        const { error: dbErr } = await supabase.from('media_library').insert(newRecord);
        if (dbErr) throw dbErr;
      } catch (dbErr) {
        console.warn('Database save failed, writing to localStorage only:', dbErr);
      }

      // Update state & local storage anyway to ensure it stays active
      const updatedList = [newRecord, ...mediaItems];
      setMediaItems(updatedList);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

      showStatus('success', 'Imagem adicionada com sucesso!');
      setIsUploadOpen(false);
      resetUploadForm();
    } catch (err: any) {
      showStatus('error', `Falha ao adicionar imagem: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadPreview(null);
    setUploadForm({
      display_name: '',
      alt_text: '',
      caption: '',
      category: 'Ambiente',
      tags: '',
      credits: '',
      focal_x: 50,
      focal_y: 50,
      width: 0,
      height: 0,
      orientation: 'horizontal',
      mime_type: '',
      file_size: 0
    });
  };

  // Open Edit panel/modal
  const handleEditClick = (item: MediaItem) => {
    setSelectedItem(item);
    setEditForm({
      display_name: item.display_name,
      alt_text: item.alt_text || '',
      caption: item.caption || '',
      category: item.category || 'Outros',
      tags: item.tags ? item.tags.join(', ') : '',
      credits: item.credits || '',
      focal_x: item.focal_x || 50,
      focal_y: item.focal_y || 50,
      zoom: item.zoom || 1.0
    });
    setIsEditOpen(true);
    setActiveMenuId(null);
  };

  // Edit save handler
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      const updatedFields = {
        display_name: editForm.display_name,
        alt_text: editForm.alt_text,
        caption: editForm.caption,
        category: editForm.category,
        tags: editForm.tags ? editForm.tags.split(',').map(t => t.trim()) : [],
        focal_x: editForm.focal_x,
        focal_y: editForm.focal_y,
        zoom: editForm.zoom,
        updated_at: new Date().toISOString()
      };

      // 1. Try to update in Supabase
      try {
        const { error: dbErr } = await supabase
          .from('media_library')
          .update(updatedFields)
          .eq('id', selectedItem.id);
        if (dbErr) throw dbErr;
      } catch (dbErr) {
        console.warn('DB update failed, saving locally:', dbErr);
      }

      // Update state & localStorage
      const updatedList = mediaItems.map(item => 
        item.id === selectedItem.id ? { ...item, ...updatedFields } : item
      );
      setMediaItems(updatedList);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

      showStatus('success', 'Alterações salvas com sucesso!');
      setIsEditOpen(false);
    } catch (err: any) {
      showStatus('error', `Erro ao salvar alterações: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Replace file handler
  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showStatus('error', 'O arquivo excede o peso de 5 MB.');
      return;
    }

    setReplaceFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setReplacePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !replaceFile || !replacePreview) return;

    setIsSubmitting(true);
    try {
      const fileExt = replaceFile.name.split('.').pop();
      const storagePath = `public/media-${Date.now()}.${fileExt}`;
      let newPublicUrl = '';

      // 1. Upload new file
      try {
        const { error: uploadErr } = await supabase.storage
          .from('site-media')
          .upload(storagePath, replaceFile, { cacheControl: '3600', upsert: true });

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabase.storage
          .from('site-media')
          .getPublicUrl(storagePath);
        
        newPublicUrl = publicUrlData.publicUrl;

        // Delete old file from storage asynchronously
        if (selectedItem.storage_path && !selectedItem.public_url.startsWith('http') && !selectedItem.public_url.startsWith('data:')) {
          supabase.storage.from('site-media').remove([selectedItem.storage_path]);
        }
      } catch (storageErr) {
        console.warn('Storage replace upload failed, using local Base64 URL:', storageErr);
        newPublicUrl = replacePreview;
      }

      // Read dimensions of replaced file
      const img = new Image();
      img.onload = async () => {
        const orientation = img.width > img.height ? 'horizontal' : (img.width < img.height ? 'vertical' : 'square');
        const updatedFields = {
          file_name: replaceFile.name,
          storage_path: storagePath,
          public_url: newPublicUrl,
          mime_type: replaceFile.type,
          file_size: replaceFile.size,
          width: img.width,
          height: img.height,
          orientation,
          updated_at: new Date().toISOString()
        };

        // Try to update DB
        try {
          const { error: dbErr } = await supabase
            .from('media_library')
            .update(updatedFields)
            .eq('id', selectedItem.id);
          if (dbErr) throw dbErr;
        } catch (dbErr) {
          console.warn('DB replace update failed, updating locally:', dbErr);
        }

        // Reset image error states if it was broken
        if (brokenImages[selectedItem.id]) {
          setBrokenImages(prev => {
            const copy = { ...prev };
            delete copy[selectedItem.id];
            return copy;
          });
        }

        // Update state
        const updatedList = mediaItems.map(item => 
          item.id === selectedItem.id ? { ...item, ...updatedFields } : item
        );
        setMediaItems(updatedList);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

        showStatus('success', 'Imagem substituída com sucesso!');
        setIsReplaceOpen(false);
        setReplaceFile(null);
        setReplacePreview(null);
        
        // Also sync editing modal if it's open
        if (isEditOpen) {
          setSelectedItem(prev => prev ? { ...prev, ...updatedFields } : null);
        }
      };
      img.src = replacePreview;
    } catch (err: any) {
      showStatus('error', `Erro ao substituir arquivo: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDeleteClick = (item: MediaItem) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteConfirm = async (options: { removeLocations: boolean }) => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      // 1. Delete from Supabase Storage
      if (selectedItem.storage_path) {
        try {
          await supabase.storage.from('site-media').remove([selectedItem.storage_path]);
        } catch (storageErr) {
          console.warn('Could not delete file from Supabase storage:', storageErr);
        }
      }

      // 2. Delete from Supabase DB
      try {
        const { error: dbErr } = await supabase
          .from('media_library')
          .delete()
          .eq('id', selectedItem.id);
        if (dbErr) throw dbErr;
      } catch (dbErr) {
        console.warn('Could not delete from Supabase DB, deleting locally:', dbErr);
      }

      // Update state
      const updatedList = mediaItems.filter(item => item.id !== selectedItem.id);
      setMediaItems(updatedList);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

      showStatus('success', 'Imagem excluída permanentemente.');
      setIsDeleteOpen(false);
      setSelectedItem(null);
    } catch (err: any) {
      showStatus('error', `Erro ao excluir imagem: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy url to clipboard
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showStatus('info', 'URL copiada para a área de transferência!');
    setActiveMenuId(null);
  };

  // Download file locally
  const handleDownload = (item: MediaItem) => {
    const link = document.createElement('a');
    link.href = item.public_url;
    link.download = item.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setActiveMenuId(null);
  };

  // Reset filter inputs
  const resetFilters = () => {
    setSelectedCategory('Todos');
    setFilterFormat('Todos');
    setFilterOrientation('Todos');
    setFilterUsage('Todos');
    setFilterError('Todos');
    setSearchTerm('');
  };

  // Filtering calculations
  const filteredItems = mediaItems.filter(item => {
    // 1. Search term (matches name, alt text, tag, category)
    const matchSearch = searchTerm === '' || 
      item.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.alt_text && item.alt_text.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

    if (!matchSearch) return false;

    // 2. Category filter
    if (selectedCategory !== 'Todos' && item.category !== selectedCategory) return false;

    // 3. Format/MIME type filter
    if (filterFormat !== 'Todos') {
      const mime = item.mime_type.toLowerCase();
      if (filterFormat === 'PNG' && !mime.includes('png')) return false;
      if (filterFormat === 'JPG' && !mime.includes('jpeg') && !mime.includes('jpg')) return false;
      if (filterFormat === 'WebP' && !mime.includes('webp')) return false;
      if (filterFormat === 'AVIF' && !mime.includes('avif')) return false;
      if (filterFormat === 'SVG' && !mime.includes('svg')) return false;
    }

    // 4. Orientation filter
    if (filterOrientation !== 'Todos') {
      if (filterOrientation === 'Horizontal' && item.orientation !== 'horizontal') return false;
      if (filterOrientation === 'Vertical' && item.orientation !== 'vertical') return false;
      if (filterOrientation === 'Quadrada' && item.orientation !== 'square') return false;
    }

    // 5. Usage filter
    const usages = getImageUsage(item.public_url);
    const inUse = usages.length > 0;
    if (filterUsage === 'Em uso' && !inUse) return false;
    if (filterUsage === 'Sem uso' && inUse) return false;

    // 6. Error filter (broken images)
    const hasError = !!brokenImages[item.id];
    if (filterError === 'Com erro' && !hasError) return false;
    if (filterError === 'Sem erro' && hasError) return false;

    return true;
  });

  return (
    <div className="space-y-6 text-[#F6F3EC]">
      
      {/* Top Banner Status message */}
      {statusMsg.type && (
        <div className={`p-4 rounded-xl border flex items-center justify-between animate-fadeIn z-50 ${
          statusMsg.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
          statusMsg.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
          'bg-blue-500/10 border-blue-500/30 text-blue-400'
        }`}>
          <div className="flex items-center gap-3">
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
             statusMsg.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            <span className="text-sm font-medium">{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg({ type: null, text: '' })} className="p-1 hover:bg-white/10 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2">Biblioteca de Mídia</h1>
          <p className="text-[#F6F3EC]/70">Gerencie e envie imagens do escritório e eventos.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shrink-0"
        >
          <Upload className="w-5 h-5" />
          Fazer Upload
        </button>
      </div>

      {/* Toolbar Search & Advanced Filters */}
      <div className="bg-[#151f1f] border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F6F3EC]/40" />
            <input 
              type="text" 
              placeholder="Buscar por nome, categoria, tag, texto alternativo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#101616] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[#F6F3EC] focus:outline-none focus:border-[#D8CBB3]/50 transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3 border rounded-xl font-medium transition-all ${
                isFilterOpen 
                  ? 'bg-[#D8CBB3] text-[#101616] border-[#D8CBB3]' 
                  : 'bg-[#101616] border-white/10 text-[#F6F3EC]/80 hover:border-[#D8CBB3]/40'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filtros Avançados
            </button>
            {(searchTerm || selectedCategory !== 'Todos' || filterFormat !== 'Todos' || filterOrientation !== 'Todos' || filterUsage !== 'Todos' || filterError !== 'Todos') && (
              <button 
                onClick={resetFilters}
                className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/25 rounded-xl transition-all text-sm font-medium"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Advanced Filters Panel */}
        {isFilterOpen && (
          <div className="pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 animate-fadeIn">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F6F3EC]/50 mb-2 font-medium">Categoria</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#101616] border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]"
              >
                <option>Todos</option>
                <option>Ambiente</option>
                <option>Atuação</option>
                <option>Excelência</option>
                <option>Liderança</option>
                <option>Eventos</option>
                <option>Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F6F3EC]/50 mb-2 font-medium">Formato</label>
              <select 
                value={filterFormat} 
                onChange={(e) => setFilterFormat(e.target.value)}
                className="w-full bg-[#101616] border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]"
              >
                <option>Todos</option>
                <option>PNG</option>
                <option>JPG</option>
                <option>WebP</option>
                <option>AVIF</option>
                <option>SVG</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F6F3EC]/50 mb-2 font-medium">Orientação</label>
              <select 
                value={filterOrientation} 
                onChange={(e) => setFilterOrientation(e.target.value)}
                className="w-full bg-[#101616] border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]"
              >
                <option>Todos</option>
                <option>Horizontal</option>
                <option>Vertical</option>
                <option>Quadrada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F6F3EC]/50 mb-2 font-medium">Uso no Site</label>
              <select 
                value={filterUsage} 
                onChange={(e) => setFilterUsage(e.target.value)}
                className="w-full bg-[#101616] border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]"
              >
                <option>Todos</option>
                <option>Em uso</option>
                <option>Sem uso</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F6F3EC]/50 mb-2 font-medium">Carregamento</label>
              <select 
                value={filterError} 
                onChange={(e) => setFilterError(e.target.value)}
                className="w-full bg-[#101616] border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]"
              >
                <option>Todos</option>
                <option>Sem erro</option>
                <option>Com erro</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid View */}
      {isLoading ? (
        <div className="py-24 text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-[#D8CBB3] animate-spin mx-auto" />
          <p className="text-[#F6F3EC]/70">Carregando biblioteca de mídia...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => {
            const usages = getImageUsage(item.public_url);
            const isImageBroken = !!brokenImages[item.id];
            
            return (
              <div 
                key={item.id} 
                className="group relative flex flex-col rounded-2xl border border-white/10 overflow-hidden bg-[#151f1f] shadow-lg hover:border-[#D8CBB3]/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Image Showcase area */}
                <div className="relative aspect-[4/3] bg-black/40 overflow-hidden flex items-center justify-center">
                  {isImageBroken ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-red-500/5 text-center space-y-2">
                      <AlertTriangle className="w-8 h-8 text-red-400" />
                      <span className="text-sm font-semibold text-red-400">Imagem indisponível</span>
                      <p className="text-xs text-[#F6F3EC]/40 truncate w-full">{item.file_name}</p>
                      
                      <div className="flex gap-2 pt-2 z-20">
                        <button 
                          onClick={() => { setSelectedItem(item); setIsReplaceOpen(true); }}
                          className="px-2 py-1 bg-white/10 hover:bg-[#D8CBB3] hover:text-[#101616] rounded text-[10px] font-semibold transition-colors"
                        >
                          Substituir
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item)}
                          className="px-2 py-1 bg-red-500/10 hover:bg-red-500 text-white rounded text-[10px] font-semibold transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={item.public_url} 
                      alt={item.alt_text || item.display_name} 
                      onError={() => setBrokenImages(prev => ({ ...prev, [item.id]: true }))}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        objectPosition: `${item.focal_x || 50}% ${item.focal_y || 50}%`,
                        transform: `scale(${item.zoom || 1.0})`
                      }}
                    />
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                    {item.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#101616]/80 text-[#D8CBB3] px-2.5 py-0.5 rounded border border-[#D8CBB3]/30 backdrop-blur-sm">
                        {item.category}
                      </span>
                    )}

                  </div>

                  {/* Actions overlay - Desktop hover */}
                  {!isImageBroken && (
                    <div className="absolute inset-0 bg-[#101616]/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                      <button 
                        onClick={() => { setSelectedItem(item); setIsPreviewOpen(true); }}
                        className="p-2.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] rounded-xl transition-all hover:scale-110"
                        title="Visualizar"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEditClick(item)}
                        className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all hover:scale-110 border border-white/20"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(item)}
                        className="p-2.5 bg-red-500/20 hover:bg-red-500 text-white rounded-xl transition-all hover:scale-110 border border-red-500/30"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* 3 Dots Menu - ALWAYS visible/clickable */}
                  <div className="absolute top-3 right-3 z-30">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === item.id ? null : item.id);
                      }}
                      className="p-2 bg-[#101616]/80 hover:bg-[#101616] text-[#F6F3EC] rounded-full border border-white/10 backdrop-blur-sm transition-all focus:outline-none"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Popover Dropdown menu */}
                    {activeMenuId === item.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#151f1f] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fadeIn z-40">
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/5 hover:text-[#D8CBB3] border-b border-white/5 transition-colors flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" /> Editar informações
                        </button>
                        <button 
                          onClick={() => { setSelectedItem(item); setIsReplaceOpen(true); setActiveMenuId(null); }}
                          className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/5 hover:text-[#D8CBB3] border-b border-white/5 transition-colors flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" /> Substituir imagem
                        </button>
                        <button 
                          onClick={() => handleCopyUrl(item.public_url)}
                          className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/5 hover:text-[#D8CBB3] border-b border-white/5 transition-colors flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" /> Copiar URL
                        </button>
                        {usages.length > 0 && (
                          <button 
                            onClick={() => {
                              alert(`Esta imagem está sendo utilizada em: \n• ${usages.join('\n• ')}`);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/5 hover:text-[#D8CBB3] border-b border-white/5 transition-colors flex items-center gap-2"
                          >
                            <Info className="w-4 h-4" /> Onde está sendo usada?
                          </button>
                        )}
                        <button 
                          onClick={() => handleDownload(item)}
                          className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-white/5 hover:text-[#D8CBB3] border-b border-white/5 transition-colors flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" /> Baixar arquivo
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item)}
                          className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-sm text-[#FFFDF8] truncate" title={item.display_name}>
                      {item.display_name}
                    </h3>
                    <p className="text-[10px] text-[#F6F3EC]/50 font-mono mt-1 uppercase">
                      {item.mime_type.split('/')[1] || 'DESCONHECIDO'} • {(item.file_size / 1024).toFixed(0)} KB
                    </p>
                    {item.alt_text && (
                      <p className="text-xs text-[#F6F3EC]/70 mt-2 line-clamp-1 italic">
                        "{item.alt_text}"
                      </p>
                    )}
                  </div>

                  {/* Mobile Actions - Row below image */}
                  <div className="flex xl:hidden gap-2 pt-2 border-t border-white/5">
                    <button 
                      onClick={() => { setSelectedItem(item); setIsPreviewOpen(true); }}
                      className="flex-1 py-1.5 bg-[#D8CBB3]/10 hover:bg-[#D8CBB3] hover:text-[#101616] text-[#D8CBB3] rounded text-xs font-medium transition-colors"
                    >
                      Visualizar
                    </button>
                    <button 
                      onClick={() => handleEditClick(item)}
                      className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded text-xs font-medium border border-white/10 transition-colors"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(item)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded border border-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 border border-dashed border-white/10 rounded-2xl text-center">
          <ImageIcon className="w-16 h-16 text-[#D8CBB3]/20 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-[#FFFDF8] mb-2 font-medium">Nenhum arquivo encontrado</h3>
          <p className="text-[#F6F3EC]/50">Tente redefinir seus filtros ou digite um termo de busca diferente.</p>
        </div>
      )}

      {/* ==================================================
          MODAL: UPLOAD IMAGEM (ADICIONAR)
          ================================================== */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <h2 className="text-xl font-serif text-[#FFFDF8] flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#D8CBB3]" /> Fazer upload de nova imagem
              </h2>
              <button 
                onClick={() => { setIsUploadOpen(false); resetUploadForm(); }}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
              
              {/* File input / drag area */}
              {!uploadPreview ? (
                <div className="relative border-2 border-dashed border-[#D8CBB3]/30 hover:border-[#D8CBB3] rounded-2xl p-8 text-center bg-[#101616]/50 transition-colors flex flex-col items-center justify-center cursor-pointer">
                  <input 
                    type="file" 
                    onChange={handleUploadFileChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 rounded-full bg-[#D8CBB3]/10 flex items-center justify-center text-[#D8CBB3] mb-4">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1 text-[#FFFDF8]">Selecione um arquivo de imagem</h4>
                  <p className="text-xs text-[#F6F3EC]/50">PNG, JPG, WebP, AVIF ou SVG (Máx: 5MB)</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left: Preview column */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="relative aspect-square bg-black/40 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                      <img 
                        src={uploadPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: `${uploadForm.focal_x}% ${uploadForm.focal_y}%` }}
                      />
                      {/* Focal point indicator crosshair */}
                      <div 
                        className="absolute w-6 h-6 border-2 border-[#D8CBB3] rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none shadow-2xl"
                        style={{ left: `${uploadForm.focal_x}%`, top: `${uploadForm.focal_y}%` }}
                      >
                        <div className="w-1.5 h-1.5 bg-[#D8CBB3] rounded-full" />
                      </div>
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={() => { setUploadFile(null); setUploadPreview(null); }}
                      className="w-full py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-all"
                      disabled={isSubmitting}
                    >
                      Remover arquivo
                    </button>

                    {/* Image details */}
                    <div className="bg-[#101616]/50 rounded-xl p-3 border border-white/5 space-y-1.5 text-[10px] font-mono uppercase text-[#F6F3EC]/60">
                      <p><span className="text-[#F6F3EC]/40">Nome:</span> {uploadFile?.name}</p>
                      <p><span className="text-[#F6F3EC]/40">Formato:</span> {uploadForm.mime_type}</p>
                      <p><span className="text-[#F6F3EC]/40">Tamanho:</span> {(uploadForm.file_size / 1024).toFixed(0)} KB</p>
                      <p><span className="text-[#F6F3EC]/40">Dimensões:</span> {uploadForm.width}x{uploadForm.height} PX</p>
                      <p><span className="text-[#F6F3EC]/40">Orientação:</span> {uploadForm.orientation}</p>
                    </div>
                  </div>

                  {/* Right: Metadata inputs */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Nome para exibição</label>
                      <input 
                        type="text"
                        value={uploadForm.display_name}
                        onChange={(e) => setUploadForm({ ...uploadForm, display_name: e.target.value })}
                        required
                        className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Categoria</label>
                        <select 
                          value={uploadForm.category}
                          onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                          className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                        >
                          <option>Ambiente</option>
                          <option>Atuação</option>
                          <option>Excelência</option>
                          <option>Liderança</option>
                          <option>Eventos</option>
                          <option>Outros</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Créditos</label>
                        <input 
                          type="text"
                          placeholder="Autor da foto"
                          value={uploadForm.credits}
                          onChange={(e) => setUploadForm({ ...uploadForm, credits: e.target.value })}
                          className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Texto Alternativo (Alt Text)</label>
                      <input 
                        type="text"
                        placeholder="Descrição da imagem para acessibilidade"
                        value={uploadForm.alt_text}
                        onChange={(e) => setUploadForm({ ...uploadForm, alt_text: e.target.value })}
                        className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Legenda (Caption)</label>
                      <textarea 
                        rows={2}
                        placeholder="Texto descritivo exibido no site"
                        value={uploadForm.caption}
                        onChange={(e) => setUploadForm({ ...uploadForm, caption: e.target.value })}
                        className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Tags (separadas por vírgula)</label>
                      <input 
                        type="text"
                        placeholder="ex: equipe, escritorio, recife"
                        value={uploadForm.tags}
                        onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                        className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                      />
                    </div>

                    {/* Focal point picking sliders */}
                    <div className="p-3 bg-[#101616]/50 rounded-xl border border-white/5 space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">
                        <span>Ponto Focal</span>
                        <span className="text-[#D8CBB3] font-mono">{uploadForm.focal_x}% X, {uploadForm.focal_y}% Y</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-[#F6F3EC]/50 uppercase tracking-wide mb-1">Eixo X (Horizontal)</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={uploadForm.focal_x}
                            onChange={(e) => setUploadForm({ ...uploadForm, focal_x: parseInt(e.target.value) })}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D8CBB3]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-[#F6F3EC]/50 uppercase tracking-wide mb-1">Eixo Y (Vertical)</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={uploadForm.focal_y}
                            onChange={(e) => setUploadForm({ ...uploadForm, focal_y: parseInt(e.target.value) })}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D8CBB3]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsUploadOpen(false); resetUploadForm(); }}
                  className="px-5 py-2.5 bg-transparent hover:bg-white/5 border border-white/10 hover:text-white rounded-xl text-sm font-semibold transition-all"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={!uploadFile || isSubmitting}
                  className="px-6 py-2.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] disabled:bg-white/5 disabled:text-[#F6F3EC]/30 text-[#101616] font-semibold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Adicionando...
                    </div>
                  ) : 'Adicionar imagem'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL: EDITAR IMAGEM (E METADADOS)
          ================================================== */}
      {isEditOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <h2 className="text-xl font-serif text-[#FFFDF8] flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#D8CBB3]" /> Editar detalhes da imagem
              </h2>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Left side preview */}
                <div className="md:col-span-5 space-y-4">
                  <div className="relative aspect-square bg-black/40 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                    <img 
                      src={selectedItem.public_url} 
                      alt={selectedItem.alt_text} 
                      className="w-full h-full object-cover"
                      style={{ 
                        objectPosition: `${editForm.focal_x}% ${editForm.focal_y}%`,
                        transform: `scale(${editForm.zoom})`
                      }}
                    />
                    {/* Focal Crosshair overlay */}
                    <div 
                      className="absolute w-6 h-6 border-2 border-[#D8CBB3] rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none shadow-2xl"
                      style={{ left: `${editForm.focal_x}%`, top: `${editForm.focal_y}%` }}
                    >
                      <div className="w-1.5 h-1.5 bg-[#D8CBB3] rounded-full" />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => { setIsReplaceOpen(true); }}
                    className="w-full py-2.5 bg-white/10 border border-white/10 hover:bg-[#D8CBB3] hover:text-[#101616] text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    <RefreshCw className="w-4 h-4" /> Substituir arquivo de imagem
                  </button>

                  {/* Metadata display */}
                  <div className="bg-[#101616]/50 rounded-xl p-4 border border-white/5 space-y-2 text-[10px] font-mono uppercase text-[#F6F3EC]/60">
                    <h5 className="text-xs text-[#D8CBB3] border-b border-white/10 pb-1 mb-2 font-serif font-bold">Metadados Técnicos</h5>
                    <p><span className="text-[#F6F3EC]/40">Arquivo:</span> <span className="text-[#FFFDF8] lowercase break-all">{selectedItem.file_name}</span></p>
                    <p><span className="text-[#F6F3EC]/40">Mime-type:</span> {selectedItem.mime_type}</p>
                    <p><span className="text-[#F6F3EC]/40">Peso:</span> {(selectedItem.file_size / 1024).toFixed(0)} KB</p>
                    {selectedItem.width && <p><span className="text-[#F6F3EC]/40">Dimensões:</span> {selectedItem.width}x{selectedItem.height} PX ({selectedItem.orientation})</p>}
                    <p><span className="text-[#F6F3EC]/40">Localização:</span> <span className="text-[#FFFDF8] lowercase break-all">{selectedItem.storage_path}</span></p>
                    <p><span className="text-[#F6F3EC]/40">Enviada em:</span> {new Date(selectedItem.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                </div>

                {/* Right side inputs */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Nome para exibição</label>
                    <input 
                      type="text"
                      value={editForm.display_name}
                      onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                      required
                      className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Categoria</label>
                      <select 
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                      >
                        <option>Ambiente</option>
                        <option>Atuação</option>
                        <option>Excelência</option>
                        <option>Liderança</option>
                        <option>Eventos</option>
                        <option>Outros</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Créditos</label>
                      <input 
                        type="text"
                        placeholder="Fotógrafo / Autor"
                        value={editForm.credits}
                        onChange={(e) => setEditForm({ ...editForm, credits: e.target.value })}
                        className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Texto Alternativo (Alt Text)</label>
                    <input 
                      type="text"
                      placeholder="Descrição de acessibilidade"
                      value={editForm.alt_text}
                      onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                      className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Legenda (Caption)</label>
                    <textarea 
                      rows={2}
                      placeholder="Legenda para ser exibida abaixo da imagem no site"
                      value={editForm.caption}
                      onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                      className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Tags (separadas por vírgula)</label>
                    <input 
                      type="text"
                      placeholder="Tags para busca"
                      value={editForm.tags}
                      onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                      className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                    />
                  </div>

                  {/* Focal Point & Zoom Sliders */}
                  <div className="p-4 bg-[#101616]/50 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">
                      <span>Ajustes de Enquadramento</span>
                      <span className="text-[#D8CBB3] font-mono">Ponto Focal: {editForm.focal_x}% X, {editForm.focal_y}% Y • Zoom: {editForm.zoom.toFixed(1)}x</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-[#F6F3EC]/50 uppercase tracking-wide mb-1">Eixo X (Horizontal)</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={editForm.focal_x}
                          onChange={(e) => setEditForm({ ...editForm, focal_x: parseInt(e.target.value) })}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D8CBB3]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#F6F3EC]/50 uppercase tracking-wide mb-1">Eixo Y (Vertical)</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={editForm.focal_y}
                          onChange={(e) => setEditForm({ ...editForm, focal_y: parseInt(e.target.value) })}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D8CBB3]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#F6F3EC]/50 uppercase tracking-wide mb-1">Zoom da Imagem</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        step="0.1"
                        value={editForm.zoom}
                        onChange={(e) => setEditForm({ ...editForm, zoom: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D8CBB3]"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <div className="text-xs text-[#F6F3EC]/40">
                  ID: {selectedItem.id}
                </div>
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsEditOpen(false)}
                    className="px-5 py-2.5 bg-transparent hover:bg-white/5 border border-white/10 hover:text-white rounded-xl text-sm font-semibold transition-all"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Salvando...
                      </div>
                    ) : 'Salvar alterações'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL: SUBSTITUIR IMAGEM (MANTÉM O ID)
          ================================================== */}
      {isReplaceOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <h2 className="text-xl font-serif text-[#FFFDF8] flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#D8CBB3]" /> Substituir arquivo de imagem
              </h2>
              <button 
                onClick={() => { setIsReplaceOpen(false); setReplaceFile(null); setReplacePreview(null); }}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleReplaceSubmit} className="p-6 space-y-6">
              
              <p className="text-sm text-[#F6F3EC]/70">
                A nova imagem irá substituir fisicamente o arquivo antigo no servidor, mantendo as vinculações, o ID (<span className="font-mono text-xs text-[#D8CBB3]">{selectedItem.id}</span>) e o texto alternativo já cadastrados no site.
              </p>

              {/* Side by side comparison or upload selection */}
              {!replacePreview ? (
                <div className="relative border-2 border-dashed border-[#D8CBB3]/30 hover:border-[#D8CBB3] rounded-2xl p-10 text-center bg-[#101616]/50 transition-colors flex flex-col items-center justify-center cursor-pointer">
                  <input 
                    type="file" 
                    onChange={handleReplaceFileChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 rounded-full bg-[#D8CBB3]/10 flex items-center justify-center text-[#D8CBB3] mb-4">
                    <RefreshCw className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1 text-[#FFFDF8]">Selecione a nova imagem substituta</h4>
                  <p className="text-xs text-[#F6F3EC]/50">PNG, JPG, WebP ou AVIF (Máx: 5MB)</p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Side-by-side view */}
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Left: Old Image */}
                    <div className="space-y-2">
                      <span className="block text-xs font-semibold text-[#F6F3EC]/50 uppercase tracking-wider text-center">Imagem Atual</span>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-black/40 flex items-center justify-center relative">
                        {!!brokenImages[selectedItem.id] ? (
                          <div className="text-center p-3 text-red-400 text-xs flex flex-col items-center gap-1">
                            <AlertTriangle className="w-6 h-6" /> Imagem Quebrada
                          </div>
                        ) : (
                          <img src={selectedItem.public_url} alt="Atual" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute bottom-2 left-2 right-2 bg-black/75 px-2 py-1 rounded text-[9px] font-mono truncate text-center text-[#F6F3EC]/70">
                          {selectedItem.file_name}
                        </div>
                      </div>
                    </div>

                    {/* Right: New Image */}
                    <div className="space-y-2">
                      <span className="block text-xs font-semibold text-[#D8CBB3] uppercase tracking-wider text-center">Nova Imagem</span>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#D8CBB3]/30 bg-black/40 flex items-center justify-center relative">
                        <img src={replacePreview} alt="Nova" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 right-2 bg-black/75 px-2 py-1 rounded text-[9px] font-mono truncate text-center text-[#D8CBB3]">
                          {replaceFile?.name}
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-center">
                    <button 
                      type="button" 
                      onClick={() => { setReplaceFile(null); setReplacePreview(null); }}
                      className="px-4 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-semibold transition-all"
                      disabled={isSubmitting}
                    >
                      Selecionar outro arquivo
                    </button>
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsReplaceOpen(false); setReplaceFile(null); setReplacePreview(null); }}
                  className="px-5 py-2.5 bg-transparent hover:bg-white/5 border border-white/10 hover:text-white rounded-xl text-sm font-semibold transition-all"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={!replaceFile || isSubmitting}
                  className="px-6 py-2.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] disabled:bg-white/5 disabled:text-[#F6F3EC]/30 text-[#101616] font-semibold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Substituindo...
                    </div>
                  ) : 'Confirmar substituição'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL: CONFIRMAÇÃO DE EXCLUSÃO (VERIFICA VÍNCULOS)
          ================================================== */}
      {isDeleteOpen && selectedItem && (() => {
        const usages = getImageUsage(selectedItem.public_url);
        const inUse = usages.length > 0;
        
        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-[#151f1f] border border-red-500/30 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
              
              {/* Header */}
              <div className="p-5 border-b border-white/10 bg-red-500/10 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-serif text-[#FFFDF8] font-semibold">Excluir imagem permanentemente?</h3>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-black/30 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                    {!!brokenImages[selectedItem.id] ? (
                      <div className="w-full h-full flex items-center justify-center bg-red-500/5 text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    ) : (
                      <img src={selectedItem.public_url} alt="Thumbnail" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#FFFDF8] truncate">{selectedItem.display_name}</p>
                    <p className="text-[10px] text-[#F6F3EC]/50 font-mono mt-0.5 truncate">{selectedItem.file_name}</p>
                    <p className="text-xs text-[#F6F3EC]/50 mt-1">Tamanho: {(selectedItem.file_size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>

                {/* Usage Warning Panel */}
                {inUse ? (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl space-y-2">
                    <h4 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Esta imagem está sendo utilizada no site!
                    </h4>
                    <p className="text-xs text-[#F6F3EC]/80">
                      Ela está vinculada às seguintes áreas do site:
                    </p>
                    <ul className="list-disc list-inside text-xs text-yellow-300/90 font-medium space-y-1">
                      {usages.map((use, idx) => (
                        <li key={idx}>{use}</li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-[#F6F3EC]/50 leading-relaxed pt-1">
                      A exclusão deixará os locais indicados acima sem imagem ou com erros. Recomendamos substituir a imagem antes de excluí-la.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-xs text-green-400 font-medium">
                      ✓ Esta imagem não está sendo utilizada em nenhum local rastreável do site público e pode ser excluída com segurança.
                    </p>
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/5 bg-[#101616] flex flex-col gap-2">
                
                {inUse && (
                  <button 
                    type="button"
                    onClick={() => { setIsDeleteOpen(false); setIsReplaceOpen(true); }}
                    className="w-full py-2.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] text-xs font-semibold rounded-lg transition-all text-center flex items-center justify-center gap-1.5"
                    disabled={isSubmitting}
                  >
                    <RefreshCw className="w-4 h-4" /> Substituir por outra antes de excluir
                  </button>
                )}

                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsDeleteOpen(false)}
                    className="flex-1 py-2.5 bg-transparent hover:bg-white/5 border border-white/10 hover:text-white rounded-lg text-xs font-semibold transition-all"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDeleteConfirm({ removeLocations: true })}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Excluindo...' : 'Excluir permanentemente'}
                  </button>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

      {/* ==================================================
          MODAL: VISUALIZAR / LIGHTBOX PREVIEW (ZOOM)
          ================================================== */}
      {isPreviewOpen && selectedItem && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col justify-center" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsPreviewOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-[#D8CBB3] bg-white/10 rounded-full transition-colors focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex justify-center items-center relative aspect-video">
              <img 
                src={selectedItem.public_url} 
                alt={selectedItem.alt_text} 
                className="w-full h-full object-contain"
                style={{ 
                  objectPosition: `${selectedItem.focal_x || 50}% ${selectedItem.focal_y || 50}%`,
                  transform: `scale(${selectedItem.zoom || 1.0})`
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent">
                <span className="text-[10px] uppercase tracking-widest text-[#D8CBB3] font-semibold block mb-1">
                  {selectedItem.category || 'Mídia'}
                </span>
                <h3 className="text-xl font-serif text-white font-medium">{selectedItem.display_name}</h3>
                {selectedItem.caption && <p className="text-sm text-[#F6F3EC]/70 mt-1">{selectedItem.caption}</p>}
                {selectedItem.credits && <p className="text-xs text-[#F6F3EC]/40 mt-2">Créditos: {selectedItem.credits}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
