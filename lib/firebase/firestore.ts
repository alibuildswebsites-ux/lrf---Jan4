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
  increment 
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { Property, BlogPost, Agent, Testimonial, UserProfile } from '../../types';

// --- File Upload Helper (Cloudinary) ---

export const uploadFiles = async (files: File[], folderName: string): Promise<string[]> => {
  // Hardcoded credentials as requested
  const cloudName = 'dgqufb8sj';
  const uploadPreset = 'lofton_unsigned';

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
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

// --- Properties CRUD ---

export const getProperties = async (status?: string) => {
  try {
    const propertiesRef = collection(db, 'properties');
    let q;
    
    // To avoid "Index required" errors for composite queries (where + orderBy),
    // we filter in DB and sort in memory if a filter is active.
    if (status && status !== 'All') {
      q = query(propertiesRef, where('status', '==', status));
    } else {
      // Single field sort does not require a composite index
      q = query(propertiesRef, orderBy('createdAt', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    const properties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));

    // Ensure consistent sorting by createdAt descending (Newest first)
    return properties.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

export const getPropertyById = async (id: string) => {
  try {
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Property : null;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};

export const addProperty = async (propertyData: Omit<Property, 'id'>) => {
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
    console.error("Error adding property: ", error);
    return { success: false, error: error.message };
  }
};

// Explicitly export setDoc wrapper for custom ID usage
export const setPropertyWithId = async (id: string, propertyData: Omit<Property, 'id'>) => {
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
  try {
    const docRef = doc(db, 'properties', id);
    const now = new Date().toISOString();
    
    await updateDoc(docRef, {
      ...propertyData,
      updatedAt: now
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating property: ", error);
    return { success: false, error: error.message };
  }
};

export const deleteProperty = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'properties', id));
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting property: ", error);
    return { success: false, error: error.message };
  }
};

export const incrementPropertyView = async (id: string) => {
  try {
    const docRef = doc(db, 'properties', id);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error("Error incrementing view:", error);
  }
};

// --- Blog CRUD ---

export const getBlogs = async (publishedOnly: boolean = true) => {
  try {
    const blogsRef = collection(db, 'blogs');
    let q;
    
    // To fix "The query requires an index" error:
    // Avoid combining `where` and `orderBy` on different fields in the query
    // unless a composite index exists. We fetch based on filter, then sort in memory.
    if (publishedOnly) {
      q = query(blogsRef, where('published', '==', true));
    } else {
      q = query(blogsRef, orderBy('createdAt', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));

    // Perform sort in memory
    return blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

export const getBlogBySlug = async (slug: string) => {
  try {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as BlogPost;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
};

export const addBlog = async (blogData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
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
    console.error("Error adding blog: ", error);
    return { success: false, error: error.message };
  }
};

export const updateBlog = async (id: string, blogData: Partial<BlogPost>) => {
  try {
    const docRef = doc(db, 'blogs', id);
    const now = new Date().toISOString();
    
    await updateDoc(docRef, {
      ...blogData,
      updatedAt: now
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating blog: ", error);
    return { success: false, error: error.message };
  }
};

export const deleteBlog = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'blogs', id));
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting blog: ", error);
    return { success: false, error: error.message };
  }
};

// --- Agent CRUD ---

export const getAgents = async () => {
  try {
    const agentsRef = collection(db, 'agents');
    const q = query(agentsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
  } catch (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
};

export const getAgentById = async (id: string) => {
  try {
    const docRef = doc(db, 'agents', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Agent : null;
  } catch (error) {
    console.error('Error fetching agent:', error);
    return null;
  }
};

export const addAgent = async (agentData: Omit<Agent, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => {
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
    console.error("Error adding agent: ", error);
    return { success: false, error: error.message };
  }
};

export const updateAgent = async (id: string, agentData: Partial<Agent>) => {
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
  try {
    await deleteDoc(doc(db, 'agents', id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateAgentOrder = async (agents: Agent[]) => {
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
  try {
    const testimonialsRef = collection(db, 'testimonials');
    const q = query(testimonialsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

export const addTestimonial = async (data: Omit<Testimonial, 'id' | 'order'>) => {
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
  try {
    const docRef = doc(db, 'testimonials', id);
    await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const deleteTestimonial = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'testimonials', id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateTestimonialOrder = async (testimonials: Testimonial[]) => {
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
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const deleteUserAccount = async (uid: string) => {
  try {
    await deleteDoc(doc(db, 'users', uid));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// --- User Saved Properties ---

export const saveProperty = async (userId: string, propertyId: string) => {
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
    console.error('Error fetching saved properties:', error);
    return [];
  }
};