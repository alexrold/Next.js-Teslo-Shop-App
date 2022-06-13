import { FC } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

export interface Props {
  title: string | number;
  subTitle: string;
  icon: JSX.Element;
}

export const SummaryTile: FC<Props> = ({ title, subTitle, icon }) => {

  return (
    <Grid item xs={12} sm={4} md={3} sx={{ mt: 3 }}  >
      <Card sx={{ display: 'flex' }} >
        <CardContent sx={{ width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='fadeIn' >
          {icon}
        </CardContent>

        <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }} >
          <Typography variant='h3' component='h3'>{title}</Typography>
          <Typography variant='caption' color='secondary' >{subTitle}</Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
