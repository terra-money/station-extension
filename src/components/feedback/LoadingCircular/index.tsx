import { CircularProgress, CircularProgressProps } from '@mui/material';

const LoadingCircular = (props: CircularProgressProps) => (
  <CircularProgress variant='inherit' {...props} />
);

export default LoadingCircular;
