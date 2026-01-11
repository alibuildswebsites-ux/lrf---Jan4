import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  arrayUnion, 
  arrayRemove, 
  addDoc, 
  writeBatch, 
  increment,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { Property, BlogPost, Agent, Testimonial, UserProfile } from '../../types';

// --- Helper for Type Safety ---
const mapDoc = <T>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  return {
    id: doc.id,
    ...doc.data()
  } as T;
};

// --- Logger Helper ---
const logError = (message: string, error: any) => {
  if (import.meta.env.DEV) {
    console.error(message, error);
  }
};

// --- File Upload Helper (Cloudinary) ---

export const uploadFiles = async (files: File[], folderName: string): Promise<string[]> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing. Please check .env file.");
  }

  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    if (folderName) {
      formData.append('folder', `lofton-realty/${folderName}`);
    }

    // Determine resource type based on file MIME type
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  });

  try {
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error) {
    logError("Cloudinary upload error:", error);
    throw error;
  }
};

// --- Properties CRUD ---

export const getProperties = async (filters: { status?: string; location?: string } = {}) => {
  if (!db) return [];
  try {
    const propertiesRef = collection(db, 'properties');
    const constraints = [];

    // Filter by Status (Exact match)
    if (filters.status && filters.status !== 'All') {
      constraints.push(where('status', '==', filters.status));
    }

    // Filter by Location/City (Exact match)
    if (filters.location && filters.location !== 'All') {
      constraints.push(where('city', '==', filters.location));
    }

    // Apply DB sorting only if no filters are active to avoid composite index errors
    if (constraints.length === 0) {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    const q = query(propertiesRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const properties = snapshot.docs.map(doc => mapDoc<Property>(doc));

    // Always sort by Date Descending in memory to ensure consistency
    return properties.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    logError('Error fetching properties:', error);
    return [];
  }
};

export const getPropertyById = async (id: string) => {
  if (!db) return null;
  try {
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Property : null;
  } catch (error) {
    logError('Error fetching property:', error);
    return null;
  }
};

export const addProperty = async (propertyData: Omit<Property, 'id'>) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    // Generate a new ID first to create a folder for images
    const newDocRef = doc(collection(db, 'properties'));
    const now = new Date().toISOString();
    
    await setDoc(newDocRef, {
      ...propertyData,
      id: newDocRef.id,
      views: 0,
      createdAt: now,
      updatedAt: now
    });
    
    return { success: true, id: newDocRef.id };
  } catch (error: any) {
    logError("Error adding property: ", error);
    return { success: false, error: error.message };
  }
};

export const setPropertyWithId = async (id: string, propertyData: Omit<Property, 'id'>) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    const now = new Date().toISOString();
    await setDoc(doc(db, 'properties', id), {
      ...propertyData,
      views: 0,
      createdAt: now,
      updatedAt: now
    });
    return { success: true, id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateProperty = async (id: string, propertyData: Partial<Property>) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    const docRef = doc(db, 'properties', id);
    const now = new Date().toISOString();
    
    await updateDoc(docRef, {
      ...propertyData,
      updatedAt: now
    });
    
    return { success: true };
  } catch (error: any) {
    logError("Error updating property: ", error);
    return { success: false, error: error.message };
  }
};

export const deleteProperty = async (id: string) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    await deleteDoc(doc(db, 'properties', id));
    return { success: true };
  } catch (error: any) {
    logError("Error deleting property: ", error);
    return { success: false, error: error.message };
  }
};

export const incrementPropertyView = async (id: string) => {
  if (!db) return;
  try {
    const docRef = doc(db, 'properties', id);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    logError("Error incrementing view:", error);
  }
};

// --- Blog CRUD ---

export const getBlogs = async (publishedOnly: boolean = true) => {
  if (!db) return [];
  try {
    const blogsRef = collection(db, 'blogs');
    let q;
    
    if (publishedOnly) {
      q = query(blogsRef, where('published', '==', true));
    } else {
      q = query(blogsRef, orderBy('createdAt', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    const blogs = snapshot.docs.map(doc => mapDoc<BlogPost>(doc));

    return blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    logError('Error fetching blogs:', error);
    return [];
  }
};

export const getBlogBySlug = async (slug: string) => {
  if (!db) return null;
  try {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as BlogPost;
  } catch (error) {
    logError('Error fetching blog by slug:', error);
    return null;
  }
};

export const addBlog = async (blogData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    const blogsRef = collection(db, 'blogs');
    const now = new Date().toISOString();
    
    let slug = blogData.slug;
    const existing = await getBlogBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const docRef = await addDoc(blogsRef, {
      ...blogData,
      slug,
      createdAt: now,
      updatedAt: now
    });
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    logError("Error adding blog: ", error);
    return { success: false, error: error.message };
  }
};

export const updateBlog = async (id: string, blogData: Partial<BlogPost>) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    const docRef = doc(db, 'blogs', id);
    const now = new Date().toISOString();
    
    await updateDoc(docRef, {
      ...blogData,
      updatedAt: now
    });
    
    return { success: true };
  } catch (error: any) {
    logError("Error updating blog: ", error);
    return { success: false, error: error.message };
  }
};

export const deleteBlog = async (id: string) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    await deleteDoc(doc(db, 'blogs', id));
    return { success: true };
  } catch (error: any) {
    logError("Error deleting blog: ", error);
    return { success: false, error: error.message };
  }
};

// --- Agent CRUD ---

export const getAgents = async () => {
  if (!db) return [];
  try {
    const agentsRef = collection(db, 'agents');
    const q = query(agentsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapDoc<Agent>(doc));
  } catch (error) {
    logError('Error fetching agents:', error);
    return [];
  }
};

export const getAgentById = async (id: string) => {
  if (!db) return null;
  try {
    const docRef = doc(db, 'agents', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Agent : null;
  } catch (error) {
    logError('Error fetching agent:', error);
    return null;
  }
};

export const addAgent = async (agentData: Omit<Agent, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    const agentsRef = collection(db, 'agents');
    const now = new Date().toISOString();
    const snapshot = await getDocs(agentsRef);
    const order = snapshot.size;

    const docRef = await addDoc(agentsRef, {
      ...agentData,
      order,
      createdAt: now,
      updatedAt: now
    });
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    logError("Error adding agent: ", error);
    return { success: false, error: error.message };
  }
};

export const updateAgent = async (id: string, agentData: Partial<Agent>) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    const docRef = doc(db, 'agents', id);
    const now = new Date().toISOString();
    await updateDoc(docRef, { ...agentData, updatedAt: now });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const deleteAgent = async (id: string) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    await deleteDoc(doc(db, 'agents', id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateAgentOrder = async (agents: Agent[]) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    const batch = writeBatch(db);
    agents.forEach((agent, index) => {
      const docRef = doc(db, 'agents', agent.id);
      batch.update(docRef, { order: index });
    });
    await batch.commit();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// --- Testimonials CRUD ---

export const getTestimonials = async () => {
  if (!db) return [];
  try {
    const testimonialsRef = collection(db, 'testimonials');
    const q = query(testimonialsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapDoc<Testimonial>(doc));
  } catch (error) {
    logError('Error fetching testimonials:', error);
    return [];
  }
};

export const addTestimonial = async (data: Omit<Testimonial, 'id' | 'order'>) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    const ref = collection(db, 'testimonials');
    const now = new Date().toISOString();
    const snapshot = await getDocs(ref);
    const order = snapshot.size;

    const docRef = await addDoc(ref, {
      ...data,
      order,
      createdAt: now,
      updatedAt: now
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateTestimonial = async (id: string, data: Partial<Testimonial>) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    const docRef = doc(db, 'testimonials', id);
    await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const deleteTestimonial = async (id: string) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    await deleteDoc(doc(db, 'testimonials', id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateTestimonialOrder = async (testimonials: Testimonial[]) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    const batch = writeBatch(db);
    testimonials.forEach((item, index) => {
      const docRef = doc(db, 'testimonials', item.id);
      batch.update(docRef, { order: index });
    });
    await batch.commit();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// --- Client Management ---

export const getAllUsers = async () => {
  if (!db) return [];
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
  } catch (error) {
    logError('Error fetching users:', error);
    return [];
  }
};

export const deleteUserAccount = async (uid: string) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    await deleteDoc(doc(db, 'users', uid));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// --- User Saved Properties ---

export const saveProperty = async (userId: string, propertyId: string) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      savedProperties: arrayUnion(propertyId)
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const unsaveProperty = async (userId: string, propertyId: string) => {
  if (!db) return { success: false, error: "Database connection failed" };
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      savedProperties: arrayRemove(propertyId)
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getSavedProperties = async (userId: string) => {
  if (!db) return [];
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return [];
    
    const savedIds = userDoc.data().savedProperties || [];
    if (savedIds.length === 0) return [];
    
    const properties = await Promise.all(
      savedIds.map((id: string) => getPropertyById(id))
    );
    
    return properties.filter(p => p !== null) as Property[];
  } catch (error) {
    logError('Error fetching saved properties:', error);
    return [];
  }
};