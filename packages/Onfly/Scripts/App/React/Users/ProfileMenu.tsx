import React, { MouseEvent } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Material UI
import Menu from '@material-ui/core/Menu';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Fade from '@material-ui/core/Fade';

// Reducers
import { selectTranslatedResources } from '../../Reducers/app/selectors';

import { InvitationDetails } from '../../Reducers/Users/Invitations/types';

type Props = {
  resources: any;
  title: string;
  profile: InvitationDetails;
  anchorEl?: Element;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  onClose: () => void;
  onClickPrimaryAction: (event: MouseEvent, invitation: InvitationDetails) => void;
  onClickSecondaryAction: (event: MouseEvent, invitation: InvitationDetails) => void;
};

const ProfileMenu: React.FC<Props> = ({
  // mapStateToProps
  resources,
  // Props
  title,
  profile,
  anchorEl,
  primaryActionLabel,
  secondaryActionLabel,
  onClose,
  onClickPrimaryAction,
  onClickSecondaryAction,
}) => {
  if (profile == null) {
    return null;
  }

  return (
    <Menu
      id="profile-menu"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={Boolean(anchorEl)}
      onClose={onClose}
      TransitionComponent={Fade}
    >
      <div className="boarding-pass-profile">
        <h2 className="text-center">{title}</h2>
      </div>
      <Card>
        <CardContent>
          <Typography>
            <TextField
              id="email"
              label={resources.UsersManagement.AccessRequestProfileEmail}
              value={profile.Email}
              InputProps={{ readOnly: true }}
            />
          </Typography>
          <Typography>
            <TextField
              id="fname"
              label={resources.UsersManagement.AccessRequestProfileFname}
              value={profile.User?.FirstName}
              InputProps={{ readOnly: true }}
              disabled={!profile.User?.FirstName}
            />
          </Typography>
          <Typography>
            <TextField
              id="lname"
              label={resources.UsersManagement.AccessRequestProfileLname}
              value={profile.User?.LastName}
              InputProps={{ readOnly: true }}
              disabled={!profile.User?.LastName}
            />
          </Typography>
          <Typography>
            <TextField
              id="jobtitle"
              label={resources.UsersManagement.AccessRequestProfileJobTitle}
              value={profile.User?.Job}
              InputProps={{ readOnly: true }}
              disabled={!profile.User?.Job}
            />
            <TextField
              id="city"
              label={resources.UsersManagement.AccessRequestProfileCity}
              value={profile.User?.City}
              InputProps={{ readOnly: true }}
              disabled={!profile.User?.City}
            />
          </Typography>
        </CardContent>
        <CardActions>
          <div className="btn-container">
            {onClickSecondaryAction && (
              <Button
                className="btn-flat"
                onClick={(event) => onClickSecondaryAction(event, profile)}
              >
                {secondaryActionLabel}
              </Button>
            )}
            {onClickPrimaryAction && (
              <Button
                className="btn-flat blue"
                onClick={(event) => onClickPrimaryAction(event, profile)}
              >
                {primaryActionLabel}
              </Button>
            )}
          </div>
        </CardActions>
      </Card>
    </Menu>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(React.memo(ProfileMenu));