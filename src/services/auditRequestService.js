const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/audit-requests`;

const index = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.search) {
      params.append('search', filters.search);
    }

    if (filters.status) {
      params.append('status', filters.status);
    }

    if (filters.priority) {
      params.append('priority', filters.priority);
    }

    if (filters.department) {
      params.append('department', filters.department);
    }

    let url = BASE_URL;

    if (params.toString()) {
      url = `${BASE_URL}?${params.toString()}`;
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const show = async (requestId) => {
  try {
    const res = await fetch(`${BASE_URL}/${requestId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const create = async (formData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const update = async (requestId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${requestId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteRequest = async (requestId) => {
  try {
    const res = await fetch(`${BASE_URL}/${requestId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.err);
    }

    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export {
  index,
  show,
  create,
  update,
  deleteRequest,
};