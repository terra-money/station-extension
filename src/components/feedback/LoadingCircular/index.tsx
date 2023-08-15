import { CircularProgress, CircularProgressProps } from '@mui/material';

const LoadingCircular = (props: CircularProgressProps) => (
  <CircularProgress color='inherit' {...props} />
);

export default LoadingCircular;
