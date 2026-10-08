/**
 * Client Project Store Service
 * Handles persistence for client projects with local API and localStorage fallback.
 */

const LOCAL_STORAGE_KEY = 'agency_client_projects_v2';

export async function fetchProjects() {
  try {
    const res = await fetch('/api/projects');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.projects)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.projects));
        return json.projects;
      }
    }
  } catch (err) {
    console.warn('[projectStore] Using local storage fallback:', err.message);
  }

  // Fallback to localStorage
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return [];
}

export async function saveProject(project) {
  try {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.projects)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.projects));
        return json.projects;
      }
    }
  } catch (err) {
    console.warn('[projectStore] Falling back to localStorage for save');
  }

  // Local fallback
  const projects = await fetchProjects();
  const now = new Date().toISOString();
  if (project.id) {
    const idx = projects.findIndex(p => p.id === project.id);
    if (idx !== -1) {
      projects[idx] = { ...projects[idx], ...project, updatedAt: now };
    } else {
      projects.unshift({ ...project, createdAt: now, updatedAt: now });
    }
  } else {
    projects.unshift({ ...project, id: `proj_${Date.now()}`, createdAt: now, updatedAt: now });
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  return projects;
}

export async function duplicateProject(id) {
  try {
    const res = await fetch(`/api/projects/${id}/duplicate`, { method: 'POST' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.projects)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.projects));
        return json.projects;
      }
    }
  } catch (err) {
    console.warn('[projectStore] Local fallback duplicate');
  }

  const projects = await fetchProjects();
  const target = projects.find(p => p.id === id);
  if (target) {
    const now = new Date().toISOString();
    const copy = {
      ...JSON.parse(JSON.stringify(target)),
      id: `proj_${Date.now()}`,
      name: `${target.name} (Copy)`,
      clientName: `${target.clientName} (Copy)`,
      createdAt: now,
      updatedAt: now,
      status: 'Draft'
    };
    projects.unshift(copy);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  }
  return projects;
}

export async function deleteProject(id) {
  try {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.projects)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.projects));
        return json.projects;
      }
    }
  } catch (err) {
    console.warn('[projectStore] Local fallback delete');
  }

  let projects = await fetchProjects();
  projects = projects.filter(p => p.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  return projects;
}

export async function refreshTemplatesDiscovery() {
  try {
    const res = await fetch('/api/templates/refresh', { method: 'POST' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.templates)) {
        return json.templates;
      }
    }
  } catch (err) {
    console.error('[projectStore] Template refresh error:', err);
  }
  return null;
}
