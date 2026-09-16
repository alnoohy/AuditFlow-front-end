const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/departments`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL);

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
    if (!res.ok) throw new Error(data.err);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const update = async (departmentId, formData) => {
  try {
    const res = await fetch(`${BASE_URL}/${departmentId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.err);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteDepartment = async (departmentId) => {
  try {
    const res = await fetch(`${BASE_URL}/${departmentId}`, {
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


export { index, create, update, deleteDepartment };