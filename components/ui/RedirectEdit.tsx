import { Box, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';

interface Props {
  href: string;
  msg?: string;
}
export const RedirectEdit: FC<Props> = ({ href, msg = 'Editar' }) => {
  return (
    <Box display='flex' justifyContent='end'>
      <NextLink href={href} passHref>
        <Link underline='always' >
          <Typography variant='subtitle2' component='h5' color='secondary' sx={{ my: 2 }} >{msg}</Typography>
        </Link>
      </NextLink>
    </Box>
  )
}