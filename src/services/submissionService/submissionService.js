const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/audit-requests`;

const create = async (requsetId, submissionData) => {
  try {
    const response = await fetch(`${BASE_URL}/${requsetId}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(submissionData),
    });

    const data = await response.json();
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const update = async (requsetId, submissionId, updateFormData) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${requsetId}/submissions/${submissionId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateFormData),
      },
    );
  } catch (err) {
    console.log(err);
  }
};
