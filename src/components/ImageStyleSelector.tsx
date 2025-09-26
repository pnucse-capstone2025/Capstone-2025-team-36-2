import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

interface ImageStyle {
  id: string;
  name: string;
  displayName: string;
}

interface ImageStyleSelectorProps {
  selectedStyle: string;
  customStyle: string;
  isCustomStyle: boolean;
  onStyleSelect: (styleId: string) => void;
  onCustomStyleChange: (customStyle: string) => void;
  onCustomStyleToggle: () => void;
  onCustomStyleAdd?: (customStyle: string) => void;
  styles: {
    section: any;
    sectionTitle: any;
    styleOptionsContainer: any;
    styleOption: any;
    styleOptionActive: any;
    styleOptionText: any;
    styleOptionTextActive: any;
    customStyleContainer: any;
    customStyleToggle: any;
    customStyleToggleActive: any;
    customStyleToggleText: any;
    customStyleToggleTextActive: any;
    customStyleInput: any;
  };
  imageStyles: ImageStyle[];
}

const ImageStyleSelector: React.FC<ImageStyleSelectorProps> = ({
  selectedStyle,
  customStyle,
  isCustomStyle,
  onStyleSelect,
  onCustomStyleChange,
  onCustomStyleToggle,
  onCustomStyleAdd,
  styles,
  imageStyles,
}) => {
  const handleCustomStyleSubmit = () => {
    if (customStyle.trim() && onCustomStyleAdd) {
      onCustomStyleAdd(customStyle.trim());
    }
  };

  const handleCustomStyleBlur = () => {
    if (customStyle.trim() && onCustomStyleAdd) {
      onCustomStyleAdd(customStyle.trim());
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>이미지 스타일</Text>
      
      <View style={styles.styleOptionsContainer}>
        {imageStyles.map((style) => (
          <TouchableOpacity
            key={style.id}
            style={[
              styles.styleOption,
              selectedStyle === style.id && styles.styleOptionActive,
            ]}
            onPress={() => onStyleSelect(style.id)}
          >
            <Text style={[
              styles.styleOptionText,
              selectedStyle === style.id && styles.styleOptionTextActive,
            ]}>
              {style.displayName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* 커스텀 스타일을 별도 컨테이너로 분리하되 줄바꿈 적용 */}
      <View style={styles.customStyleContainer}>
        <TouchableOpacity
          style={[
            styles.customStyleToggle,
            isCustomStyle && styles.customStyleToggleActive
          ]}
          onPress={onCustomStyleToggle}
        >
          <Text style={[
            styles.customStyleToggleText,
            isCustomStyle && styles.customStyleToggleTextActive
          ]}>
            커스텀 스타일
          </Text>
        </TouchableOpacity>
        
        {isCustomStyle && (
          <TextInput
            style={styles.customStyleInput}
            value={customStyle}
            onChangeText={onCustomStyleChange}
            onSubmitEditing={handleCustomStyleSubmit}
            onBlur={handleCustomStyleBlur}
            placeholder="스타일을 입력하세요 (예: watercolor, oil painting)"
            placeholderTextColor="#999999"
            returnKeyType="done"
          />
        )}
      </View>
    </View>
  );
};

export default ImageStyleSelector;

