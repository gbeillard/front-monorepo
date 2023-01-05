import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Dropdown, Toggle, ToggleLabel } from '@bim-co/componentui-foundation';
import { updatePreferences as updatePreferencesAction } from '../../../../Reducers/preferences/actions';

import { selectPreferences } from '../../../../Reducers/preferences/selectors';
import { selectIsBoostOffer, selectTranslatedResources } from '../../../../Reducers/app/selectors';

import { Section, SubSection } from '../../Components';

import { Preferences, RevitUploadPreference } from '../../../../Reducers/preferences/types';

type Option = { value: RevitUploadPreference; label: string };

type Props = {
  resources: any;
  preferences: Preferences;
  updatePreferences: (preferences: Preferences) => void;
  isBoostOffer: boolean;
};

const Sections: React.FC<Props> = ({ resources, preferences, updatePreferences, isBoostOffer }) => {
  const handleDropdown = useCallback(
    (option: Option) => {
      const RevitUploadPreference = option.value;
      updatePreferences({ RevitUploadPreference });
    },
    [updatePreferences]
  );

  const handleToggleDownload = useCallback(
    (RevitDownloadPreference) => {
      updatePreferences({ RevitDownloadPreference });
    },
    [updatePreferences]
  );

  const handleToggleUpload = useCallback(
    (UploadMapping) => {
      updatePreferences({ UploadMapping });
    },
    [updatePreferences]
  );

  const options: Option[] = useMemo(
    () => [
      { value: RevitUploadPreference.FamilyName, label: resources.Preferences.UploadFamilyName },
      {
        value: RevitUploadPreference.ParameterModel,
        label: resources.Preferences.UploadModelParameter,
      },
    ],
    [resources]
  );

  const value: Option = useMemo(
    () => options.find((option) => option.value === preferences.RevitUploadPreference),
    [options, preferences.RevitUploadPreference]
  );

  return (
    <>
      {!isBoostOffer && (
          <Section title={resources.Preferences.UploadTitle}>
            <SubSection
            title={resources.Preferences.UploadSubtitle}
            description={resources.Preferences.UploadDescription}
            end={5}
            >
                <Dropdown value={value} options={options} onChange={handleDropdown}/>
            </SubSection>
            <SubSection
                title={resources?.Preferences?.UploadMappingSubtitle}
                description={resources?.Preferences?.UploadMappingDescription}
                end={5}
            >
                <ToggleLabel>
                    <Toggle
                        label={preferences.UploadMapping
                            ? resources?.Preferences?.DownloadEnabled
                            : resources?.Preferences?.DownloadDisabled}
                        checked={preferences?.UploadMapping}
                        onChange={handleToggleUpload}/>
                </ToggleLabel>
            </SubSection>
          </Section>
      )}
      <Section title={resources.Preferences.DownloadTitle}>
        <SubSection
          title={resources.Preferences.DownloadSubtitle}
          description={resources.Preferences.DownloadDescription}
        >
          <ToggleLabel>
            <Toggle
              label={
                preferences.RevitDownloadPreference
                  ? resources.Preferences.DownloadEnabled
                  : resources.Preferences.DownloadDisabled
              }
              checked={preferences.RevitDownloadPreference}
              onChange={handleToggleDownload}
            />
          </ToggleLabel>
        </SubSection>
      </Section>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  preferences: selectPreferences,
  resources: selectTranslatedResources,
  isBoostOffer: selectIsBoostOffer,
});

const mapDispatchToProps = (dispatch: any) => ({
  updatePreferences: (preferences: Preferences) => dispatch(updatePreferencesAction(preferences)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sections);
