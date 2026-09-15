const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/departments`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
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

export { index };