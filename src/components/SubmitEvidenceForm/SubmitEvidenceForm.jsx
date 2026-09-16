import { useState } from "react";
import * as submissionService from "../../services/submissionService/submissionService";
import { useParams, useNavigate } from "react-router";

const SubmitEvidenceForm = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    comments: "",
    evidenceUrl: null,
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };
  const handleFileChange = (evt) => {
    setFormData({ ...formData, evidenceFile: evt.target.files[0] });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await submissionService.create(requestId, formData);
      navigate(`/audit-requests/${requestId}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="submit-evidence-container">
      <h2>Submit Evidence</h2>
      <p>Upload your file and add comments for this request</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="comments-input">Comments</label>
          <textarea
            required
            name="comments"
            id="comments-input"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Add a comment about your submission..."
          />
        </div>

        <div>
          <label htmlFor="file-input">Upload Evidence</label>
          <input
            required
            type="file"
            accept=".pdf, .docx, .xlsx, .png, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, image/png"
            id="file-input"
            onChange={handleFileChange} // Now this function exists!
          />
          <small>PDF, DOCX, XLSX, PNG</small>
        </div>

        <div className="button-group">
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit">Submit Evidence</button>
        </div>
      </form>
    </main>
  );
};

export default SubmitEvidenceForm;
