import { useParams } from 'react-router-dom';

export default function FeedbackPage() {
  const { email } = useParams();
  return <h1>Send anonymous feedback to: {email}</h1>;
}
