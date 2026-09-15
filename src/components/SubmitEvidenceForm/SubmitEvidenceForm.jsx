import { useState } from "react";
import * as submissionService from "../../services/submissionService";
import { useParams, useNavigate } from "react-router";

const SubmitEvidenceForm = () => {
  const { requestId } = useParams();

  const [formData, setFormData] = useState({
    comments: "",
    evidenceUrl: "",
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
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
      <p>Add your evidence and comments for this request</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="comments-input">Comments</label>
          <textarea
            required
            type="text"
            name="comments"
            id="comments-input"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Add a comment about your submission..."
          />
        </div>

        <div>
          <label htmlFor="evidenceUrl-input">Upload Evidence (Link)</label>
          <input
            required
            type="url"
            name="evidenceUrl"
            id="evidenceUrl-input"
            value={formData.evidenceUrl}
            onChange={handleChange}
            placeholder="Paste evidence URL (PDF, DOCX, etc.)"
          />
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
