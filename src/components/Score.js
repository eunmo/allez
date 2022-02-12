export default function Score({ scores }) {
  if (scores.length !== 2) {
    return <div />;
  }

  return (
    <div className={scores[0] < scores[1] ? 'light-text' : ''}>{scores[0]}</div>
  );
}
