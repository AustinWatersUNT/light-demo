import { CircularProgress, Stack } from "@mui/material";
import { PRIMARY_COLOR } from "../constants/app";

interface Props {
    loading?: boolean;
    children: React.ReactNode | React.ReactNode[]
}

function LoadingContainer({ loading, children }: Props) {
  return (
    <Stack justifyContent={loading ? 'center' : undefined}alignItems={loading ? 'center' : undefined} height="100%">
        {loading ? <CircularProgress size={100} sx={{ color: PRIMARY_COLOR }} /> : children}
    </Stack>
  );
}

export default LoadingContainer;
