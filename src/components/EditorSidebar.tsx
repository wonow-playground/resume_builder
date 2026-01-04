import React, { useState } from "react";
import { ResumeConfig, SectionItem, Section } from "@/types/resume";
import { ResumeStyle, ThemeCategory, SectionTheme } from "@/types/style";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Save,
  Layout,
  Type,
  Sun,
  Moon,
  Eye,
  EyeOff,
  RefreshCw,
  GripVertical,
} from "lucide-react";
import { TechStackInput } from "@/components/ui";
import styles from "./EditorSidebar.module.css";
import { notify } from "@/utils/notify";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Section Item Component
interface SortableSectionProps {
  section: Section;
  openSection: string | null;
  toggleSection: (id: string) => void;
  toggleSectionVisibility: (id: string) => void;
  handleSectionTitleChange: (sectionId: string, title: string) => void;
  addSectionItem: (id: string) => void;
  removeSectionItem: (sectionId: string, itemId: string) => void;
  handleSectionItemChange: (
    sectionId: string,
    itemId: string,
    field: keyof SectionItem,
    value: string | string[] | undefined
  ) => void;
  handlePointChange: (
    sectionId: string,
    itemId: string,
    index: number,
    value: string
  ) => void;
  addPoint: (sectionId: string, itemId: string) => void;
  removePoint: (sectionId: string, itemId: string, index: number) => void;
  onSave: () => void;
}

const SortableSection: React.FC<SortableSectionProps> = ({
  section,
  openSection,
  toggleSection,
  toggleSectionVisibility,
  handleSectionTitleChange,
  addSectionItem,
  removeSectionItem,
  handleSectionItemChange,
  handlePointChange,
  addPoint,
  removePoint,
  onSave,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.section}>
      <div
        className={styles.sectionHeader}
        onClick={() => toggleSection(section.id)}
      >
        <div className={styles.sectionHeaderContent}>
          <div
            {...attributes}
            {...listeners}
            style={{
              cursor: "grab",
              display: "flex",
              alignItems: "center",
              marginRight: "4px",
            }}
          >
            <GripVertical size={16} style={{ color: "#9ca3af" }} />
          </div>
          {openSection === section.id ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
          <span style={{ opacity: section.visible === false ? 0.5 : 1 }}>
            {section.title}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionVisibility(section.id);
            }}
            className={styles.addBtn}
            title={section.visible === false ? "섹션 표시" : "섹션 숨기기"}
            style={{
              opacity: 1,
              color: section.visible === false ? "#9ca3af" : "#2563eb",
            }}
          >
            {section.visible === false ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addSectionItem(section.id);
              onSave();
            }}
            className={styles.addBtn}
            title="항목 추가"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {openSection === section.id && (
        <div className={styles.expandedContent}>
          {/* Section Title Editor */}
          <div
            style={{
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <label className={styles.label}>섹션 제목</label>
            <input
              className={styles.input}
              placeholder="섹션 제목 (예: Projects, Experience)"
              value={section.title}
              onChange={(e) =>
                handleSectionTitleChange(section.id, e.target.value)
              }
              style={{ marginTop: "0.25rem" }}
            />
          </div>

          {section.items.map((item: SectionItem) => (
            <div key={item.id} className={styles.itemWrapper}>
              <button
                onClick={() => removeSectionItem(section.id, item.id)}
                className={styles.deleteBtn}
                title="삭제"
              >
                <Trash2 size={16} />
              </button>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <input
                  className={styles.input}
                  placeholder="제목 (예: 프로젝트명)"
                  value={item.title}
                  onChange={(e) =>
                    handleSectionItemChange(
                      section.id,
                      item.id,
                      "title",
                      e.target.value
                    )
                  }
                />
                <div className={styles.row}>
                  <input
                    className={styles.input}
                    placeholder="부제 (예: 역할/팀)"
                    value={item.subtitle || ""}
                    onChange={(e) =>
                      handleSectionItemChange(
                        section.id,
                        item.id,
                        "subtitle",
                        e.target.value
                      )
                    }
                  />
                  <input
                    className={styles.input}
                    placeholder="기간 (예: 2024.01 - 2024.12)"
                    value={item.date || ""}
                    onChange={(e) =>
                      handleSectionItemChange(
                        section.id,
                        item.id,
                        "date",
                        e.target.value
                      )
                    }
                  />
                </div>
                <textarea
                  className={styles.textarea}
                  placeholder="설명 (**굵게** 지원)"
                  value={item.description || ""}
                  onChange={(e) =>
                    handleSectionItemChange(
                      section.id,
                      item.id,
                      "description",
                      e.target.value
                    )
                  }
                />

                {/* Points */}
                <div>
                  <label
                    className={styles.label}
                    style={{ marginBottom: "0.25rem" }}
                  >
                    상세 설명 (Points)
                    <button
                      onClick={() => addPoint(section.id, item.id)}
                      style={{
                        color: "#3b82f6",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      + 추가
                    </button>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {(item.points || []).map((point, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "0.5rem" }}>
                        <textarea
                          className={styles.textarea}
                          style={{ height: "4rem" }}
                          value={point}
                          onChange={(e) =>
                            handlePointChange(
                              section.id,
                              item.id,
                              idx,
                              e.target.value
                            )
                          }
                        />
                        <button
                          onClick={() => removePoint(section.id, item.id, idx)}
                          style={{
                            color: "#9ca3af",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            alignSelf: "start",
                            marginTop: "0.5rem",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <label className={styles.label}>
                    기술 스택 (쉼표로 구분)
                  </label>
                  <TechStackInput
                    value={item.techStack}
                    onChange={(techStackArray: string[]) =>
                      handleSectionItemChange(
                        section.id,
                        item.id,
                        "techStack",
                        techStackArray
                      )
                    }
                    className={styles.input}
                    style={{ marginTop: "0.25rem" }}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              addSectionItem(section.id);
            }}
            className={styles.newItemBtn}
          >
            + 새 항목 추가
          </button>
        </div>
      )}
    </div>
  );
};

interface EditorSidebarProps {
  data: ResumeConfig;
  onDataChange: (data: ResumeConfig) => void;
  styles: ResumeStyle;
  onStyleChange: (styles: ResumeStyle) => void;
  onSave: () => void;
  isSaving: boolean;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  data,
  onDataChange,
  styles: styleConfig,
  onStyleChange,
  onSave,
  isSaving,
  isDarkMode,
  onThemeToggle,
}) => {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const [openSection, setOpenSection] = useState<string | null>("profile");
  const [activeCategory, setActiveCategory] =
    useState<ThemeCategory>("profile");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const newSections = data.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        visible: sec.visible === undefined ? false : !sec.visible,
      };
    });
    onDataChange({ ...data, sections: newSections });
  };

  const handleThemeChange = (field: keyof SectionTheme, value: number) => {
    const newTheme = { ...styleConfig.theme };
    newTheme[activeCategory] = {
      ...newTheme[activeCategory],
      [field]: value,
    };
    onStyleChange({ ...styleConfig, theme: newTheme });
  };

  const handleApplyToAll = () => {
    const categoryName =
      activeCategory === "profile"
        ? "프로필"
        : data.sections.find((s) => s.type === activeCategory)?.title ||
          activeCategory;

    notify.confirm(
      `현재 '${categoryName}' 섹션의 디자인 설정을 다른 모든 섹션에도 동일하게 적용하시겠습니까?`,
      () => {
        const currentT = styleConfig.theme[activeCategory];
        onStyleChange({
          ...styleConfig,
          theme: {
            global: { ...currentT },
            profile: { ...currentT },
            experience: { ...currentT },
            project: { ...currentT },
            education: { ...currentT },
            activity: { ...currentT },
          },
        });
        notify.success("전체 섹션에 디자인이 적용되었습니다.");
      }
    );
  };

  const currentTheme = styleConfig.theme[activeCategory];

  const handleProfileChange = (field: string, value: string) => {
    onDataChange({
      ...data,
      profile: { ...data.profile, [field]: value },
    });
  };

  const handleContactChange = (field: string, value: string) => {
    onDataChange({
      ...data,
      profile: {
        ...data.profile,
        contact: { ...data.profile.contact, [field]: value },
      },
    });
  };

  const handleSectionTitleChange = (sectionId: string, title: string) => {
    const newSections = data.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return { ...sec, title };
    });
    onDataChange({ ...data, sections: newSections });
  };

  const handleSectionItemChange = (
    sectionId: string,
    itemId: string,
    field: keyof SectionItem,
    value: string | string[] | undefined
  ) => {
    const newSections = data.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.map((item) => {
          if (item.id !== itemId) return item;
          return { ...item, [field]: value };
        }),
      };
    });
    onDataChange({ ...data, sections: newSections });
  };

  const addSectionItem = (sectionId: string) => {
    const newSections = data.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const newItem: SectionItem = {
        id: Date.now().toString(),
        title: "새 항목",
        subtitle: "",
        date: "",
        description: "",
        points: [],
      };
      return { ...sec, items: [newItem, ...sec.items] };
    });
    onDataChange({ ...data, sections: newSections });
  };

  const removeSectionItem = (sectionId: string, itemId: string) => {
    notify.confirm("정말로 이 항목을 삭제하시겠습니까?", () => {
      const newSections = data.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return { ...sec, items: sec.items.filter((i) => i.id !== itemId) };
      });
      onDataChange({ ...data, sections: newSections });
      notify.success("항목이 삭제되었습니다.");
    });
  };

  const handlePointChange = (
    sectionId: string,
    itemId: string,
    index: number,
    value: string
  ) => {
    const newSections = data.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.map((item) => {
          if (item.id !== itemId) return item;
          const newPoints = [...(item.points || [])];
          newPoints[index] = value;
          return { ...item, points: newPoints };
        }),
      };
    });
    onDataChange({ ...data, sections: newSections });
  };

  const addPoint = (sectionId: string, itemId: string) => {
    const newSections = data.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.map((item) => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            points: [...(item.points || []), "새 불렛 포인트"],
          };
        }),
      };
    });
    onDataChange({ ...data, sections: newSections });
  };

  const removePoint = (sectionId: string, itemId: string, index: number) => {
    const newSections = data.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.map((item) => {
          if (item.id !== itemId) return item;
          const newPoints = [...(item.points || [])];
          newPoints.splice(index, 1);
          return { ...item, points: newPoints };
        }),
      };
    });
    onDataChange({ ...data, sections: newSections });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.sections.findIndex((s) => s.id === active.id);
      const newIndex = data.sections.findIndex((s) => s.id === over.id);

      const newSections = arrayMove(data.sections, oldIndex, newIndex);
      onDataChange({ ...data, sections: newSections });

      // Auto-save after reordering
      setTimeout(() => onSave(), 300);
    }
  };

  return (
    <div className={`${styles.sidebar} no-print`}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>에디터</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={onThemeToggle}
            className={styles.saveBtn}
            title="테마 변경"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => onSave()}
            disabled={isSaving}
            className={styles.saveBtn}
          >
            <Save size={16} />
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "content" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("content")}
        >
          <Layout size={16} /> 내용 (Content)
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "design" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("design")}
        >
          <Type size={16} /> 디자인 (Design)
        </button>
      </div>

      {/* Content Tab */}
      {activeTab === "content" && (
        <div className={styles.content}>
          {/* Profile Section */}
          <div className={styles.section}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("profile")}
            >
              <span>프로필 (Profile)</span>
              {openSection === "profile" ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openSection === "profile" && (
              <div className={styles.formGroup}>
                <input
                  className={styles.input}
                  placeholder="이름"
                  value={data.profile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                />
                <input
                  className={styles.input}
                  placeholder="직군/역할 (예: 백엔드 개발자)"
                  value={data.profile.role}
                  onChange={(e) => handleProfileChange("role", e.target.value)}
                />
                <input
                  className={styles.input}
                  placeholder="프로필 이미지 URL (예: /me.jpg)"
                  value={data.profile.image || ""}
                  onChange={(e) => handleProfileChange("image", e.target.value)}
                />
                <textarea
                  className={styles.textarea}
                  placeholder="자기소개"
                  value={data.profile.intro}
                  onChange={(e) => handleProfileChange("intro", e.target.value)}
                />
                <div
                  style={{
                    paddingTop: "0.5rem",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <p className={styles.label}>연락처</p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <input
                      className={styles.input}
                      placeholder="이메일"
                      value={data.profile.contact.email || ""}
                      onChange={(e) =>
                        handleContactChange("email", e.target.value)
                      }
                    />
                    <input
                      className={styles.input}
                      placeholder="전화번호"
                      value={data.profile.contact.phone || ""}
                      onChange={(e) =>
                        handleContactChange("phone", e.target.value)
                      }
                    />
                    <input
                      className={styles.input}
                      placeholder="Github URL"
                      value={data.profile.contact.github || ""}
                      onChange={(e) =>
                        handleContactChange("github", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Sections - Drag & Drop */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {data.sections.map((section) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  openSection={openSection}
                  toggleSection={toggleSection}
                  toggleSectionVisibility={toggleSectionVisibility}
                  handleSectionTitleChange={handleSectionTitleChange}
                  addSectionItem={addSectionItem}
                  removeSectionItem={removeSectionItem}
                  handleSectionItemChange={handleSectionItemChange}
                  handlePointChange={handlePointChange}
                  addPoint={addPoint}
                  removePoint={removePoint}
                  onSave={onSave}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Design Tab */}
      {activeTab === "design" && (
        <div className={styles.content}>
          {/* Category Selector */}
          <div
            className={styles.formGroup}
            style={{
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <label className={styles.label}>설정 대상 (Target)</label>
            <select
              className={styles.input}
              value={activeCategory}
              onChange={(e) =>
                setActiveCategory(e.target.value as ThemeCategory)
              }
            >
              <option value="profile">프로필 (Profile)</option>
              {data.sections.map((section) => (
                <option key={section.id} value={section.type}>
                  {section.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleApplyToAll}
              className={styles.newItemBtn}
              style={{
                marginTop: "0.5rem",
                fontSize: "0.8rem",
                padding: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
              title="Apply these settings to all other sections"
            >
              <RefreshCw size={14} /> 현재 설정을 모든 섹션에 적용하기
            </button>
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderRow}>
              <label className={styles.sliderLabel}>
                헤더 크기 (이름/섹션명)
              </label>
              <span className={styles.sliderValue}>
                {currentTheme.headerSize}rem
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="0.1"
              value={currentTheme.headerSize}
              onChange={(e) =>
                handleThemeChange("headerSize", Number(e.target.value))
              }
              className={styles.slider}
            />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderRow}>
              <label className={styles.sliderLabel}>항목 제목 크기</label>
              <span className={styles.sliderValue}>
                {currentTheme.itemTitleSize}rem
              </span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2"
              step="0.05"
              value={currentTheme.itemTitleSize}
              onChange={(e) =>
                handleThemeChange("itemTitleSize", Number(e.target.value))
              }
              className={styles.slider}
            />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderRow}>
              <label className={styles.sliderLabel}>부제/메타 크기</label>
              <span className={styles.sliderValue}>
                {currentTheme.subtitleSize}rem
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={currentTheme.subtitleSize}
              onChange={(e) =>
                handleThemeChange("subtitleSize", Number(e.target.value))
              }
              className={styles.slider}
            />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderRow}>
              <label className={styles.sliderLabel}>본문 크기</label>
              <span className={styles.sliderValue}>
                {currentTheme.textSize}rem
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.2"
              step="0.025"
              value={currentTheme.textSize}
              onChange={(e) =>
                handleThemeChange("textSize", Number(e.target.value))
              }
              className={styles.slider}
            />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderRow}>
              <label className={styles.sliderLabel}>내부 간격 (Spacing)</label>
              <span className={styles.sliderValue}>
                {currentTheme.spacing}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={currentTheme.spacing}
              onChange={(e) =>
                handleThemeChange("spacing", Number(e.target.value))
              }
              className={styles.slider}
            />
          </div>

          <hr style={{ margin: "1rem 0", borderColor: "#e5e7eb" }} />

          <div className={styles.sliderGroup}>
            <div className={styles.sliderRow}>
              <label className={styles.sliderLabel}>
                섹션 간 간격 (Global)
              </label>
              <span className={styles.sliderValue}>
                {styleConfig.sectionSpacing}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={styleConfig.sectionSpacing}
              onChange={(e) =>
                onStyleChange({
                  ...styleConfig,
                  sectionSpacing: Number(e.target.value),
                })
              }
              className={styles.slider}
            />
          </div>
        </div>
      )}
    </div>
  );
};
