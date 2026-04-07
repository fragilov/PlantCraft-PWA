# 📋 BẢN ĐẶC TẢ KỸ THUẬT – PLANTCRAFT
### Ứng dụng Web AR Chăm Sóc Cây Thật × Trang Trí Ảo × Gamification
**Phiên bản:** 1.0 | **Dự án:** TDTU Vibe Coding 2026 | **Stack:** React + WebXR + Gemini API

---

## 1. TỔNG QUAN SẢN PHẨM

### 1.1 Mô tả một dòng
PlantCraft là một **Progressive Web App (PWA) mobile-first** cho phép người dùng chăm sóc cây thật, chẩn đoán bệnh lá bằng AI Vision, và trang trí cây bằng các vật phẩm voxel 3D (phong cách Minecraft) thông qua Augmented Reality — tất cả chạy hoàn toàn trên trình duyệt, không cần cài app.

### 1.2 Core Value Proposition
Thay vì mô phỏng tăng trưởng ảo (quá chậm → người dùng bỏ cuộc), PlantCraft dùng cơ chế **reward ngay lập tức**: chăm sóc cây thật → nhận Green Coins → mua vật phẩm 3D → trang trí lên cây qua AR. Vòng lặp gamification này tạo ra thói quen chăm cây bền vững.

### 1.3 Target Platform
- **Trình duyệt:** Chrome 111+ (Android), Safari 16+ (iOS) — cần hỗ trợ WebXR Device API
- **Thiết bị:** Smartphone có camera sau (ưu tiên Android ARCore / iOS ARKit)
- **Không cần backend** ở giai đoạn MVP — dùng LocalStorage + Gemini API key phía client
- **Môi trường mở rộng:** Trường học (THCS, THPT, Đại học) tích hợp vào hoạt động ngoại khóa, câu lạc bộ môi trường, tiết Sinh học thực hành.

### 1.4 User Segments — Phân Khúc Người Dùng Mở Rộng

PlantCraft phục vụ hai nhóm người dùng với nhu cầu khác nhau nhưng cùng dùng một core product:

**Nhóm 1 — Cá nhân (Consumer):** Người trẻ đô thị 18–30 tuổi yêu cây cảnh indoor, gamer casual bị thu hút bởi voxel art và cơ chế thu thập vật phẩm. Động lực chính: phần thưởng tức thì, tính thẩm mỹ cá nhân hóa, cảm giác tiến bộ qua XP/level.

**Nhóm 2 — Giáo dục (Education):** Học sinh THCS–THPT và sinh viên tham gia chương trình trồng cây tại trường, giáo viên Sinh học muốn số hóa hoạt động thực hành chăm cây của lớp. Động lực chính: học kiến thức thực vật học qua trải nghiệm thực tế, thi đua nhóm/lớp, hoàn thành nhiệm vụ học tập có chấm điểm.

Hai nhóm dùng cùng app nhưng có **luồng trải nghiệm khác nhau** — xem chi tiết tại mục 9 (Education Mode).

---

## 2. KIẾN TRÚC TỔNG THỂ

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            PlantCraft PWA                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  React UI    │  │  AR Engine   │  │  AI Vision   │  │  QR Anchor   │ │
│  │  (Lovable/v0)│  │  (A-Frame +  │  │  (Gemini     │  │  Layer       │ │
│  │              │  │   WebXR)     │  │   2.5 Flash) │  │  (MindAR.js) │ │
│  │ - Dashboard  │  │ - Hit-test   │  │ - Phân tích  │  │ - QR gen     │ │
│  │ - Shop       │  │ - Place item │  │   ảnh lá     │  │ - QR scan    │ │
│  │ - AR Screen  │  │ - DOM Overlay│  │ - JSON bệnh  │  │ - Billboard  │ │
│  │ - Scan Friend│  │ - HUD        │  │ - reward()   │  │   Label 3D   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                 │                  │                 │         │
│  ┌──────▼─────────────────▼──────────────────▼─────────────────▼────────┐│
│  │                State Manager (TypeScript + LocalStorage)              ││
│  │         { plants[], inventory[], coins, xp, anchors[] }              ││
│  └───────────────────────────────────────┬───────────────────────────────┘│
│                                          │ sync (chỉ khi QR Anchor bật)  │
│  ┌───────────────────────────────────────▼───────────────────────────────┐│
│  │              Firebase Realtime Database (Phase 3)                     ││
│  │  plantcraft-public/{plantId} → { name, hp, placedItems, updatedAt }  ││
│  └───────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Tech Stack Chi Tiết

| Layer | Công nghệ | Lý do chọn |
|---|---|---|
| UI Framework | React 18 + TypeScript | Type-safe, component-driven |
| Styling | Tailwind CSS | Mobile-first utility classes |
| AR Engine | A-Frame 1.5 + WebXR Polyfill | Chạy trên web, không cần app native |
| 3D Assets | GLTF 2.0 (Voxel models) | Nhẹ, tương thích tốt với A-Frame |
| AI Vision | Google Gemini 2.5 Flash API | Multimodal, hỗ trợ phân tích ảnh |
| QR Generation | `qrcode` (npm) | Tạo QR SVG/PNG phía client, không cần server |
| QR + Image Tracking | MindAR.js | Nhận diện QR và image target trong WebAR, nhẹ hơn AR.js |
| Realtime Sync | Firebase Realtime Database | Sync HP/tên cây giữa nhiều thiết bị theo thời gian thực |
| State | Zustand + LocalStorage sync | Đơn giản, persist tự động |
| Build | Vite | Dev server nhanh |

> **Lưu ý phân tầng:** `qrcode` + `MindAR.js` + Firebase chỉ được load khi tính năng QR Anchor được sử dụng. Người dùng không dùng Shared AR không bị ảnh hưởng bundle size.

---

## 3. GIAI ĐOẠN 1 — THIẾT KẾ UI (Dùng cho Lovable / v0)

### 3.1 Design System

**Phong cách:** "Cottagecore Tối Giản" × "Minecraft Pixel Icon"
- Nền: `#F5F0E8` (kem nhạt) cho cảm giác ấm, tự nhiên
- Accent: `#5C8A3C` (xanh lá rừng), `#E8C547` (vàng pixel)
- Font heading: `Press Start 2P` (Google Fonts — pixel font)
- Font body: `Inter` (dễ đọc trên mobile)
- Border radius card: `4px` (vuông-góc, giữ vibe Minecraft)
- Icon style: 16×16 pixel art SVG, không dùng icon tròn mềm

### 3.2 Cấu Trúc Navigation

```
App Shell
├── /dashboard              (màn hình mặc định)
├── /shop                   (cửa hàng vật phẩm)
├── /camera                 (AR cá nhân: trang trí + AI scan)
├── /scan-friend            (QR Anchor: quét cây của người khác)
└── /plant/:plantId/qr      (hiển thị QR code của cây để chia sẻ)
```

Navigation bar dưới cùng (bottom nav), 4 icon pixel: 🌿 Vườn | 🏪 Shop | 📷 Camera | 🔍 Quét bạn.

> **Lý do tách `/camera` và `/scan-friend` thành hai route riêng:** Hai màn hình này dùng hai engine AR khác nhau — `/camera` dùng WebXR hit-test để đặt vật phẩm cá nhân, còn `/scan-friend` dùng MindAR.js để nhận diện QR code và render Billboard Label. Ghép chung một route sẽ phải load cả hai thư viện cùng lúc, làm tăng thời gian khởi động đáng kể.

### 3.3 Màn Hình 1 — Dashboard (Vườn của tôi)

**Layout tổng thể:** Scroll dọc, 1 cột trên mobile

**Header:** Logo "PlantCraft" font pixel + hiển thị `💰 {coins} GC` + `⭐ LV {level}`

**Section 1 — Plant Cards:**
Mỗi cây là một card `w-full rounded-sm border-2 border-[#5C8A3C] bg-white p-3`.

Card chứa:
- Ảnh thumbnail cây (do user chụp lúc thêm cây) — `64x64px` hình vuông, object-fit: cover
- Tên cây (tối đa 20 ký tự, font pixel nhỏ)
- HP Bar: `div` có background gradient từ đỏ → xanh, width = `{hp}%`
  - HP Bar phải có animation `transition-all duration-500` khi thay đổi
  - HP được tính theo công thức: `hp = 100 - (daysSinceLastWatered * 10)`; nếu hp < 20 thì bar chớp đỏ (animation `pulse`)
- Badge trạng thái: "💧 Cần tưới" / "✅ Khỏe mạnh" / "🚨 Bệnh!" dạng pill nhỏ
- Button "AR Trang Trí" → navigate sang `/camera?plantId={id}`

**Section 2 — Quick Actions:**
Row 2 nút lớn, full-width:
- Button "➕ Thêm cây mới" → mở modal nhập tên + chụp ảnh
- Button "📋 Lịch sử chăm sóc" → bottom sheet cuộn

**Empty State:** Khi chưa có cây, hiển thị minh họa pixel art một chậu cây trống kèm text "Thêm cây đầu tiên của bạn!" và nút CTA xanh lá.

### 3.4 Màn Hình 2 — Shop (Cửa hàng vật phẩm)

**Header:** "🏪 Item Shop" + balance hiện tại

**Filter Tabs (ngang, scroll được):**
```
[Tất cả] [🎩 Mũ] [👓 Kính] [🟦 Blocks] [✨ VFX] [🔒 Hiếm]
```

**Item Grid:** 2 cột trên mobile, mỗi item card gồm:
- Preview 3D render (ảnh PNG isometric của voxel model, `80x80px`)
- Tên item (font pixel)
- Giá: `💰 {price} GC`
- Badge "MỚI" màu vàng nếu `createdAt < 7 ngày`
- Badge "HIẾM" màu tím nếu `rarity === 'rare'`
- Button "Mua" — disabled + opacity 50% nếu không đủ tiền
- Button "Trang bị" — hiển thị nếu đã sở hữu item

**Item detail bottom sheet:** Khi tap vào card → bottom sheet trượt lên hiển thị:
- Ảnh lớn hơn của item (có xoay 360° bằng CSS animation)
- Mô tả ngắn (ví dụ: "Mũ cỏ Minecraft — vật phẩm phổ biến nhất mùa xuân")
- Button "Mua ngay" hoặc "Đã sở hữu"

### 3.5 Màn Hình 3 — Camera AR

**Full screen layout** — không có navigation bar.

**Vùng camera:** `100vw × 100vh` — WebXR scene chiếm toàn màn hình.

**Kỹ thuật quan trọng — WebXR DOM Overlay:** Trong AR mode, trình duyệt chiếm toàn quyền render và các HTML element thông thường sẽ bị ẩn phía dưới camera feed. Để hiện UI lên trên AR, phải đăng ký một `<div id="ar-overlay">` với WebXR session thông qua thuộc tính `dom-overlay="root: #ar-overlay"` trên `<a-scene>`. Mọi element UI đặt bên trong div này sẽ được WebXR "float" lên trên như HUD (Heads-Up Display). Đây là lý do toàn bộ UI overlay phải nằm trong `#ar-overlay`, không phải bên ngoài.

**Cấu trúc DOM tổng thể của màn hình AR:**

```
<div class="ar-screen">          ← container bọc toàn bộ
  <a-scene ...>                  ← WebXR scene (camera feed + 3D items)
  </a-scene>

  <div id="ar-overlay">          ← ĐÂY LÀ HUD — float lên trên a-scene
    <div id="ar-hud-top">        ← Thanh HUD phía trên
    <div id="ar-hud-bottom">     ← Thanh công cụ phía dưới
  </div>
</div>
```

**UI Overlay — Thanh HUD Phía Trên (ar-hud-top):**

Thanh này luôn hiển thị trong suốt phiên AR, kể cả khi người dùng di chuyển điện thoại. Layout: `position: fixed; top: 0; left: 0; right: 0; padding: 12px 16px; background: rgba(0,0,0,0.35); backdrop-filter: blur(4px)`.

Hàng trên của HUD gồm: nút "✕" top-left để đóng AR (quay về dashboard), tên cây ở giữa (font pixel, text-shadow trắng để đọc được trên mọi nền), và badge HP dạng pill bên phải (`💚 {hp}/100`).

Hàng dưới của HUD là HP Bar toàn chiều rộng — đây là điểm mấu chốt vì người dùng cần thấy ngay tình trạng cây trong khi quét camera:

```tsx
// Component ARPlantHUD — đọc state trực tiếp từ Zustand store
// Không cần props vì plantId đã có trong URL params
const ARPlantHUD: React.FC = () => {
  const plantId = useParams().plantId;
  const plant = useGameStore(s => s.plants.find(p => p.id === plantId));

  if (!plant) return null;

  // Màu HP bar thay đổi theo ngưỡng — giúp người dùng đọc trạng thái cực nhanh
  const hpColor =
    plant.hp >= 70 ? '#4CAF50' :  // xanh lá — khỏe mạnh
    plant.hp >= 40 ? '#FFC107' :  // vàng — cần chú ý
    '#F44336';                     // đỏ — khẩn cấp

  return (
    <div
      id="ar-hud-top"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
        padding: '12px 16px',
        fontFamily: '"Press Start 2P", monospace',
      }}
    >
      {/* Hàng 1: nút đóng + tên cây + HP số */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <button onClick={closeAR} style={{ color: 'white', fontSize: 18 }}>✕</button>
        <span style={{
          flex: 1, textAlign: 'center', color: 'white',
          fontSize: 11, textShadow: '0 1px 3px rgba(0,0,0,0.8)'
        }}>
          🌿 {plant.name}
        </span>
        <span style={{
          fontSize: 10, color: hpColor, fontWeight: 'bold',
          // Chớp đỏ khi HP < 20 để cảnh báo khẩn cấp
          animation: plant.hp < 20 ? 'pulse 1s infinite' : 'none'
        }}>
          ♥ {plant.hp}
        </span>
      </div>

      {/* Hàng 2: HP Bar toàn chiều rộng */}
      <div style={{
        height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.2)',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${plant.hp}%`,
          background: hpColor,
          borderRadius: 4,
          // Transition mượt khi HP thay đổi (ví dụ sau khi tưới nước)
          transition: 'width 0.6s ease, background-color 0.4s ease',
          // Gradient để trông "sống động" hơn flat color
          backgroundImage: `linear-gradient(90deg, ${hpColor}99, ${hpColor})`,
        }} />
      </div>
    </div>
  );
};
```

**UI Overlay — Thanh Công Cụ Phía Dưới (ar-hud-bottom):**

`position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: rgba(0,0,0,0.35); backdrop-filter: blur(4px)`.

Item carousel ngang: scroll được, mỗi thumb 48×48px có border vàng sáng khi đang chọn. Button "🔍 Quét bệnh AI" nổi bật màu `#5C8A3C`, cỡ lớn, luôn visible. Loading state: spinner pixel + text "AI đang phân tích..." Success state: flash xanh + hiện modal kết quả.

**Hướng dẫn overlay:** Lần đầu dùng, hiện text animation "👆 Chạm lên cây để đặt vật phẩm" fade in/out ở giữa màn hình (bên trong `#ar-overlay`, z-index thấp hơn HUD).

---

## 4. GIAI ĐOẠN 2 — LOGIC AR (Dùng cho Cursor)

### 4.1 Cấu Trúc A-Frame Scene

File: `src/components/ARScene.tsx` — render một `<div>` chứa toàn bộ A-Frame markup.

```html
<!-- Cấu trúc HTML cơ bản của scene — Cursor sẽ implement -->
<a-scene
  webxr="requiredFeatures: hit-test, local-floor; 
         optionalFeatures: dom-overlay, anchors"
  dom-overlay="root: #ar-overlay"
  renderer="colorManagement: true; antialias: true"
  loading-screen="enabled: false"
>
  <!-- Asset registry: preload tất cả GLTF models -->
  <a-assets>
    <a-asset-item id="hat-model"   src="/assets/models/hat.gltf"></a-asset-item>
    <a-asset-item id="glass-model" src="/assets/models/glasses.gltf"></a-asset-item>
    <a-asset-item id="block-model" src="/assets/models/block.gltf"></a-asset-item>
  </a-assets>

  <!-- Reticle: vòng tròn nhỏ hiển thị vị trí hit-test -->
  <a-entity id="reticle"
    gltf-model="/assets/reticle.gltf"
    scale="0.2 0.2 0.2"
    visible="false"
    ar-hit-test
  ></a-entity>

  <!-- Container cho các vật phẩm đã đặt -->
  <a-entity id="placed-items"></a-entity>

  <!-- Camera rig -->
  <a-entity camera look-controls="enabled: false"></a-entity>
</a-scene>
```

### 4.2 Hit-Test Component

**File:** `src/ar/hit-test-component.js`

Đây là A-Frame component custom. Cursor cần implement với logic sau:

**Mục đích:** Lắng nghe WebXR hit-test frame, cập nhật vị trí `reticle`, và khi user tap màn hình thì đặt vật phẩm.

**Logic tuần tự:**
1. Trong `init()`: Request hit-test source từ `renderer.xr.getSession()` với `{ space: viewerSpace }`.
2. Trong `tick(time, delta)`: Lấy hit results từ frame. Nếu có kết quả → set `reticle.visible = true` và `reticle.object3D.position` = hit pose position.
3. Lắng nghe event `'select'` trên session → khi user tap:
   a. Lấy vị trí hiện tại của reticle.
   b. Gọi hàm `placeSelectedItem(position, quaternion)` (xem 4.3).
   c. Nếu browser hỗ trợ anchors: gọi `hitResult.createAnchor()` và lưu anchor vào state.

**Error handling:** Nếu `hit-test` không được hỗ trợ → fallback sang chế độ "tap để đặt trước camera 0.5m".

### 4.3 Hàm placeSelectedItem()

**File:** `src/ar/ar-manager.ts`

```typescript
/**
 * Đặt vật phẩm đang chọn (selectedItemId) vào vị trí AR.
 * Nếu QR anchor đang active, tự động tính tọa độ tương đối với QR.
 *
 * @param worldPosition - THREE.Vector3 từ hit-test (tọa độ world space)
 * @param worldQuaternion - THREE.Quaternion từ hit-test
 */
function placeSelectedItem(
  worldPosition: THREE.Vector3,
  worldQuaternion: THREE.Quaternion
): void {
  // 1. Lấy selectedItemId từ Zustand store
  const { selectedItemId, activeQRAnchorEntity } = useARStore.getState();
  const item = ITEM_REGISTRY[selectedItemId];
  if (!item) return;

  // 2. Tạo a-entity và render lên scene ngay lập tức (không chờ tính toán)
  const entity = document.createElement('a-entity');
  entity.setAttribute('gltf-model', `#${item.id}-model`);
  entity.setAttribute('scale', '0.3 0.3 0.3');
  entity.object3D.position.copy(worldPosition);
  entity.object3D.quaternion.copy(worldQuaternion);
  document.getElementById('placed-items')!.appendChild(entity);

  // 3. Quyết định coordinate space dựa trên trạng thái QR Anchor
  let placedItem: PlacedItem;

  if (activeQRAnchorEntity) {
    // ── CHẾ ĐỘ QR ANCHOR ────────────────────────────────────────────────
    // activeQRAnchorEntity là THREE.Object3D của <a-entity mindar-image-target>
    // Ta cần tính vị trí của item trong "không gian cục bộ của QR entity"
    //
    // Cách hoạt động của THREE.js worldToLocal():
    //   worldPosition là tọa độ trong world space (0,0,0 = gốc của scene)
    //   worldToLocal() biến đổi nó thành tọa độ trong local space của QR entity
    //   Kết quả: nếu QR entity đang ở (2,0,-1) và item ở (2.1, 0.5, -1),
    //            thì qrLocalPos = (0.1, 0.5, 0) — đây là offset tương đối
    //
    const qrLocalPos = activeQRAnchorEntity.worldToLocal(worldPosition.clone());

    // Tính rotation relative: nhân với inverse của QR rotation
    const qrInverseQuat = activeQRAnchorEntity.quaternion.clone().invert();
    const qrLocalQuat   = worldQuaternion.clone().premultiply(qrInverseQuat);

    placedItem = {
      id:                  uuidv4(),
      itemId:              selectedItemId,
      plantId:             activePlantId,
      relativePosition:    { x: worldPosition.x, y: worldPosition.y, z: worldPosition.z },
      relativeRotation:    { x: worldQuaternion.x, y: worldQuaternion.y,
                             z: worldQuaternion.z, w: worldQuaternion.w },
      qrRelativePosition:  { x: qrLocalPos.x, y: qrLocalPos.y, z: qrLocalPos.z },
      qrRelativeRotation:  { x: qrLocalQuat.x, y: qrLocalQuat.y,
                             z: qrLocalQuat.z, w: qrLocalQuat.w },
      qrRelativeScale:     { x: 0.3, y: 0.3, z: 0.3 },
      coordinateSpace:     'qr',
      isShared:            true,  // QR mode → tự động đánh dấu shared
      placedAt:            Date.now(),
    };

    // Sync ngay lên Firebase nếu cây đang public
    const plant = useGameStore.getState().plants.find(p => p.id === activePlantId);
    if (plant?.isPublic) {
      syncPlacedItemToFirebase(activePlantId, auth.currentUser!.uid, placedItem)
        .catch(err => console.warn('Firebase item sync failed:', err));
    }

  } else {
    // ── CHẾ ĐỘ CAMERA RELATIVE (MVP cũ) ─────────────────────────────────
    placedItem = {
      id:               uuidv4(),
      itemId:           selectedItemId,
      plantId:          activePlantId,
      relativePosition: { x: worldPosition.x, y: worldPosition.y, z: worldPosition.z },
      relativeRotation: { x: worldQuaternion.x, y: worldQuaternion.y,
                          z: worldQuaternion.z, w: worldQuaternion.w },
      coordinateSpace:  'camera',
      isShared:         false,
      placedAt:         Date.now(),
    };
  }

  // 4. Lưu vào LocalStorage thông qua Zustand
  useGameStore.getState().savePlacedItem(activePlantId, placedItem);
}

/**
 * Gọi hàm này khi owner quét QR của chính mình trong AR session.
 * Lưu tham chiếu đến THREE.Object3D của QR entity để dùng trong placeSelectedItem().
 *
 * @param qrEntity - The THREE.Object3D of the MindAR image-target entity
 */
function setQRAnchorEntity(qrEntity: THREE.Object3D | null): void {
  useARStore.setState({ activeQRAnchorEntity: qrEntity });

  if (qrEntity) {
    // Hiện hướng dẫn overlay: "✅ QR đã được nhận diện — giờ hãy đặt vật phẩm lên cây"
    showARNotification('✅ QR đã khóa vị trí! Đặt vật phẩm lên cây.', 'success');
  }
}
```

### 4.4 Spatial Anchor Persistence

**Cơ chế lưu trữ cơ bản (không dùng cloud):**

Mỗi khi đặt item, serialize và lưu vào LocalStorage:

```typescript
interface PlacedItem {
  id: string;           // uuid v4
  itemId: string;       // id trong ITEM_REGISTRY
  plantId: string;      // cây nào đang trang trí

  // ── Hệ tọa độ cũ (MVP cá nhân) ──────────────────────────────────────
  // Tương đối với camera khi đặt — chỉ có nghĩa trên thiết bị của owner
  relativePosition: { x: number; y: number; z: number };
  relativeRotation: { x: number; y: number; z: number; w: number };

  // ── Hệ tọa độ mới (QR Anchor / Shared AR) ───────────────────────────
  // Tương đối với QR code — có nghĩa trên MỌI thiết bị đang nhìn cùng QR
  // undefined nếu item được đặt trước khi bật QR Anchor mode
  qrRelativePosition?: { x: number; y: number; z: number };
  qrRelativeRotation?: { x: number; y: number; z: number; w: number };
  qrRelativeScale?:    { x: number; y: number; z: number };

  coordinateSpace: 'camera' | 'qr';  // phân biệt hai chế độ
  isShared: boolean;                 // true = được push lên Firebase
  placedAt: number;                  // timestamp
}
```

Khi mở lại AR session cho cùng một cây → load các `PlacedItem[]` từ LocalStorage và tạo lại a-entity. Với `coordinateSpace: 'camera'`, người dùng sẽ cần căn chỉnh lại thủ công. Với `coordinateSpace: 'qr'`, vật phẩm tự động render đúng vị trí ngay khi QR được nhận diện — không cần bước căn chỉnh.

### 4.5 AR Compatibility Check

Trước khi mount `<ARScene>`, kiểm tra:

```typescript
async function checkARSupport(): Promise<'full' | 'limited' | 'none'> {
  if (!navigator.xr) return 'none';
  const supported = await navigator.xr.isSessionSupported('immersive-ar');
  if (supported) return 'full'; // ARCore/ARKit có hit-test
  // Fallback: WebRTC camera + manual placement
  if (navigator.mediaDevices?.getUserMedia) return 'limited';
  return 'none';
}
```

- `'full'` → mount ARScene bình thường
- `'limited'` → hiển thị camera feed bằng `getUserMedia`, cho phép tap để đặt item ở vị trí cố định (overlay 2D giả lập)
- `'none'` → hiển thị thông báo "Thiết bị không hỗ trợ AR. Thử lại trên Chrome Android."

---

## 5. GIAI ĐOẠN 3 — CHẨN ĐOÁN AI (Dùng cho Cursor / Gemini)

### 5.1 API Call Function

**File:** `src/ai/diagnose-plant.ts`

```typescript
/**
 * Chụp ảnh từ canvas của WebXR scene, gửi lên Gemini Vision API,
 * nhận kết quả chẩn đoán bệnh lá.
 *
 * @param imageFile - File object từ input[type=file] hoặc canvas.toBlob()
 * @param plantName - Tên cây (để context hóa prompt)
 * @returns DiagnosisResult | null
 */

interface DiagnosisResult {
  disease: string;           // Ví dụ: "Thiếu Nitơ"
  severity: 'mild' | 'moderate' | 'severe';
  treatments: string[];      // Đúng 3 bước, ngắn gọn
  confidence: number;        // 0.0 → 1.0
  isHealthy: boolean;        // true nếu không phát hiện bệnh
}

async function diagnosePlant(
  imageFile: File | Blob,
  plantName: string
): Promise<DiagnosisResult | null> {
  // BƯỚC 1: Convert ảnh sang base64
  const base64Image = await fileToBase64(imageFile);
  const mimeType = imageFile.type || 'image/jpeg'; // 'image/jpeg' | 'image/png'

  // BƯỚC 2: Build prompt — cực kỳ cụ thể để model trả về JSON sạch
  const systemPrompt = `
Bạn là chuyên gia chẩn đoán bệnh thực vật.
Phân tích ảnh lá cây và trả về JSON với cấu trúc sau (KHÔNG có markdown, KHÔNG có backtick):
{
  "disease": "tên bệnh bằng tiếng Việt, hoặc 'Khỏe mạnh' nếu không có bệnh",
  "severity": "mild | moderate | severe",
  "treatments": ["bước 1", "bước 2", "bước 3"],
  "confidence": 0.0-1.0,
  "isHealthy": true | false
}
Tên cây: ${plantName}.
Nếu ảnh không phải lá cây, trả về { "error": "Không phải ảnh lá cây" }.
  `.trim();

  // BƯỚC 3: Gọi Gemini API
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: systemPrompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image  // base64 string, KHÔNG có prefix "data:image/..."
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,      // Thấp → ít hallucinate
          maxOutputTokens: 512
        }
      })
    }
  );

  // BƯỚC 4: Parse response
  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // BƯỚC 5: Strip markdown fences nếu model vẫn thêm vào
  const cleanJson = rawText.replace(/```json|```/g, '').trim();
  const result: DiagnosisResult = JSON.parse(cleanJson);

  // BƯỚC 6: Trigger reward nếu chẩn đoán thành công
  if (result && !result.isHealthy && result.confidence > 0.6) {
    // Lưu diagnosis vào pending — reward sẽ cộng sau khi user xác nhận chữa khỏi
    savePendingDiagnosis(result);
  } else if (result?.isHealthy) {
    // Cây khỏe → thưởng nhỏ cho việc kiểm tra
    rewardPlayer(10, 'scan_healthy');
  }

  return result;
}
```

### 5.2 Hàm rewardPlayer()

**File:** `src/store/game-store.ts` (xem thêm Giai đoạn 4)

```typescript
/**
 * Cộng phần thưởng cho người dùng và kích hoạt animation celebration.
 * @param amount - Số Green Coins cộng thêm
 * @param reason - Key lý do (để log và tránh double-reward)
 */
function rewardPlayer(amount: number, reason: string): void {
  // 1. Cộng vào store: coins += amount
  // 2. Log vào rewardHistory[] với timestamp
  // 3. Dispatch event 'reward' để UI hiển thị toast "+100 GC 🎉"
  // 4. Lưu vào LocalStorage ngay lập tức
}
```

### 5.3 Capture Frame Từ AR Scene

Khi user nhấn nút "Quét bệnh AI" trong AR mode:

```typescript
async function captureARFrame(): Promise<Blob> {
  // Lấy canvas của A-Frame scene
  const canvas = document.querySelector('canvas.a-canvas') as HTMLCanvasElement;
  // Render một frame và export
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8);
  });
}
```

Lưu ý: WebXR canvas đôi khi trả về ảnh trống do security restrictions. Fallback: dùng `getUserMedia` riêng biệt để chụp ảnh, không liên quan đến XR canvas.

---

## 6. GIAI ĐOẠN 4 — GAMIFICATION (Dùng cho Cursor / Claude)

### 6.1 Data Model (TypeScript Interfaces)

**File:** `src/types/game.types.ts`

```typescript
// ===== PLANT =====
interface Plant {
  id: string;
  name: string;
  species?: string;
  thumbnailBase64: string;      // Ảnh cây lúc thêm vào, lưu base64 nhỏ (max 100KB)
  hp: number;                   // 0–100
  lastWateredAt: number;        // timestamp ms
  lastWipedAt: number;          // "lau lá" action
  createdAt: number;
  placedItems: PlacedItem[];    // Vật phẩm AR đã gắn
  pendingDiagnosis?: DiagnosisResult;
}

// ===== INVENTORY =====
interface InventoryItem {
  itemId: string;               // key trong ITEM_REGISTRY
  purchasedAt: number;
  quantity: number;
}

// ===== SHOP ITEM =====
interface ShopItem {
  id: string;
  name: string;
  category: 'hat' | 'glasses' | 'block' | 'vfx';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  price: number;                // Green Coins
  gltfPath: string;             // path tới file .gltf
  previewImagePath: string;     // PNG isometric preview
  unlockedByDefault: boolean;
  requiredLevel?: number;
}

// ===== PLAYER STATE =====
interface PlayerState {
  coins: number;                // Green Coins
  xp: number;
  level: number;                // floor(xp / 500) + 1
  plants: Plant[];
  inventory: InventoryItem[];
  rewardHistory: RewardLog[];
  lastSyncAt: number;
}

interface RewardLog {
  id: string;
  type: 'water' | 'wipe' | 'cure_disease' | 'scan_healthy' | 'purchase';
  amount: number;
  coinsDelta: number;
  xpDelta: number;
  timestamp: number;
  plantId?: string;
}
```

### 6.2 State Manager với LocalStorage Persistence

**File:** `src/store/game-store.ts`

Dùng **Zustand** với middleware `persist` — đây là pattern chuẩn:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'plantcraft_v1';

// Bảng XP và COINS theo từng action
const REWARD_TABLE = {
  water:         { xp: 10,  coins: 0   },
  wipe:          { xp: 10,  coins: 0   },
  cure_disease:  { xp: 50,  coins: 100 },
  scan_healthy:  { xp: 5,   coins: 10  },
} as const;

interface GameActions {
  // Plant management
  addPlant: (name: string, thumbnailBase64: string) => void;
  waterPlant: (plantId: string) => void;
  wipePlant: (plantId: string) => void;
  curePlant: (plantId: string, diagnosisId: string) => void;
  updateHP: () => void;   // Gọi mỗi khi app mở để tính HP mới

  // Economy
  purchaseItem: (itemId: string) => boolean;   // false nếu không đủ tiền
  rewardPlayer: (amount: number, reason: keyof typeof REWARD_TABLE) => void;

  // AR
  savePlacedItem: (plantId: string, item: PlacedItem) => void;
  removePlacedItem: (plantId: string, itemInstanceId: string) => void;
}

export const useGameStore = create<PlayerState & GameActions>()(
  persist(
    (set, get) => ({
      // --- Initial state ---
      coins: 50,          // 50 coins khởi đầu để mua được item đầu tiên
      xp: 0,
      level: 1,
      plants: [],
      inventory: [],
      rewardHistory: [],
      lastSyncAt: Date.now(),

      // --- Actions ---
      waterPlant: (plantId) => {
        const { xp, coins } = get();
        const rewards = REWARD_TABLE.water;
        set((state) => ({
          plants: state.plants.map(p =>
            p.id === plantId
              ? { ...p, lastWateredAt: Date.now(), hp: Math.min(100, p.hp + 20) }
              : p
          ),
          xp: xp + rewards.xp,
          coins: coins + rewards.coins,
          level: Math.floor((xp + rewards.xp) / 500) + 1,
          rewardHistory: [
            ...get().rewardHistory,
            { id: uuidv4(), type: 'water', amount: rewards.xp,
              coinsDelta: rewards.coins, xpDelta: rewards.xp,
              timestamp: Date.now(), plantId }
          ]
        }));
        // Dispatch toast event
        window.dispatchEvent(new CustomEvent('plantcraft:reward', {
          detail: { xp: rewards.xp, coins: rewards.coins, action: 'Tưới nước' }
        }));
      },

      wipePlant: (plantId) => {
        // Tương tự waterPlant, dùng REWARD_TABLE.wipe
        // HP +10, XP +10
      },

      curePlant: (plantId, diagnosisId) => {
        const rewards = REWARD_TABLE.cure_disease;
        // 1. Xóa pendingDiagnosis khỏi plant
        // 2. Cộng coins + xp
        // 3. Log reward
        // 4. Dispatch 'plantcraft:reward' event với amount 100 coins
      },

      purchaseItem: (itemId) => {
        const { coins, inventory } = get();
        const item = ITEM_REGISTRY[itemId];
        if (!item || coins < item.price) return false;
        set({
          coins: coins - item.price,
          inventory: [
            ...inventory,
            { itemId, purchasedAt: Date.now(), quantity: 1 }
          ]
        });
        return true;
      },

      updateHP: () => {
        const now = Date.now();
        set((state) => ({
          plants: state.plants.map(plant => {
            const hoursSinceWater = (now - plant.lastWateredAt) / 3600000;
            const newHP = Math.max(0, 100 - Math.floor(hoursSinceWater * 4));
            // HP giảm 4 điểm mỗi giờ không tưới (~25 giờ là chết)
            return { ...plant, hp: newHP };
          })
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist các field cần thiết, bỏ qua actions
      partialize: (state) => ({
        coins: state.coins,
        xp: state.xp,
        level: state.level,
        plants: state.plants,
        inventory: state.inventory,
        rewardHistory: state.rewardHistory.slice(-100), // Chỉ giữ 100 log gần nhất
        lastSyncAt: state.lastSyncAt,
      }),
    }
  )
);
```

### 6.3 Item Registry

**File:** `src/data/item-registry.ts`

```typescript
export const ITEM_REGISTRY: Record<string, ShopItem> = {
  'hat_grass': {
    id: 'hat_grass',
    name: 'Mũ Cỏ Xanh',
    category: 'hat',
    rarity: 'common',
    price: 50,
    gltfPath: '/assets/models/hat_grass.gltf',
    previewImagePath: '/assets/previews/hat_grass.png',
    unlockedByDefault: true,
  },
  'glasses_sunflower': {
    id: 'glasses_sunflower',
    name: 'Kính Hoa Hướng Dương',
    category: 'glasses',
    rarity: 'uncommon',
    price: 120,
    gltfPath: '/assets/models/glasses_sunflower.gltf',
    previewImagePath: '/assets/previews/glasses_sunflower.png',
    unlockedByDefault: true,
  },
  'block_diamond': {
    id: 'block_diamond',
    name: 'Khối Kim Cương',
    category: 'block',
    rarity: 'rare',
    price: 300,
    gltfPath: '/assets/models/block_diamond.gltf',
    previewImagePath: '/assets/previews/block_diamond.png',
    unlockedByDefault: false,
    requiredLevel: 3,
  },
  'vfx_butterflies': {
    id: 'vfx_butterflies',
    name: 'Bướm Pixel Bay',
    category: 'vfx',
    rarity: 'rare',
    price: 250,
    gltfPath: '/assets/models/butterflies.gltf',
    previewImagePath: '/assets/previews/butterflies.png',
    unlockedByDefault: false,
  },
  'hat_crown_legendary': {
    id: 'hat_crown_legendary',
    name: 'Vương Miện Vàng',
    category: 'hat',
    rarity: 'legendary',
    price: 1000,
    gltfPath: '/assets/models/crown_gold.gltf',
    previewImagePath: '/assets/previews/crown_gold.png',
    unlockedByDefault: false,
    requiredLevel: 10,
  },
};
```

### 6.4 Reward Toast Component

**File:** `src/components/RewardToast.tsx`

Lắng nghe event `plantcraft:reward` và hiển thị notification bay lên:

```tsx
// Component này mount ở root App, lắng nghe global event
// Khi nhận event → hiển thị toast animation:
// "+10 XP ⭐ | Tưới nước" xuất hiện ở giữa màn hình, fade up, disappear sau 2s
// Nếu coins > 0: "+100 💰 Green Coins!" toast màu vàng to hơn
```

---

## 5. GIAI ĐOẠN 5 — QR CODE ANCHOR & SHARED AR (Dùng cho Cursor)

### 5.1 Tổng Quan Kỹ Thuật — Tại Sao QR Code Là Mốc Không Gian?

Vấn đề cốt lõi của Shared AR là hai điện thoại khác nhau cần "đồng ý" với nhau về vị trí trong không gian vật lý. Cloud Anchors (ARCore/ARKit) giải quyết bằng cách quét đặc điểm môi trường, nhưng không hỗ trợ trên WebXR. QR code giải quyết vấn đề này theo cách khác: thay vì để máy tự nhận diện môi trường, ta đặt một "mốc nhân tạo" vật lý (tờ giấy QR) ngay tại vị trí cây. Mỗi thiết bị khi nhìn thấy cùng một QR code sẽ biết chính xác cùng một điểm trong không gian — và từ đó có thể render nội dung AR đúng chỗ, đúng hướng, bất kể thiết bị nào đang dùng.

Luồng dữ liệu tổng thể hoạt động như sau:

```
[Owner] Tạo QR → dán lên chậu → bật Public Mode → push lên Firebase
                                                              │
                                                              ▼
[Viewer] Quét QR ──► parse plantId ──► fetch từ Firebase ──► render
                                              │
                              Firebase listener cập nhật realtime
                              khi owner chăm sóc cây (HP thay đổi)
```

### 5.2 Phía Owner — Tạo và Chia Sẻ QR Code

**File:** `src/components/QR/PlantQRScreen.tsx`

Màn hình này được navigate đến từ Plant Card bằng nút "📤 Chia sẻ". Nó thực hiện hai việc độc lập: tạo QR code để in, và bật/tắt Public Mode để sync dữ liệu lên Firebase.

```typescript
import QRCode from 'qrcode';

// Nội dung encode vào QR — đủ để người quét biết cần fetch dữ liệu gì
interface QRPayload {
  app: 'plantcraft';       // guard để phân biệt QR của PlantCraft với QR khác
  plantId: string;
  ownerUid: string;        // Firebase UID của chủ cây — dùng làm path trong DB
  version: 1;              // versioning để backward compatible sau này
}

async function generatePlantQR(plant: Plant, ownerUid: string): Promise<string> {
  const payload: QRPayload = {
    app: 'plantcraft',
    plantId: plant.id,
    ownerUid,
    version: 1,
  };

  // Encode thành JSON string rồi đưa vào QR
  // Trả về data URL của ảnh PNG — có thể dùng trực tiếp trong <img src={...}>
  const dataUrl = await QRCode.toDataURL(JSON.stringify(payload), {
    width: 300,
    margin: 2,
    color: {
      dark: '#2D4A1E',   // màu xanh rừng — giữ vibe Cottagecore thay vì đen thuần
      light: '#F5F0E8',  // màu nền kem của app
    },
    errorCorrectionLevel: 'H', // mức cao nhất — chịu được QR bị bẩn hoặc nhòe 30%
  });

  return dataUrl;
}
```

**Public Mode Toggle — Sync Lên Firebase:**

Khi owner bật toggle "Chia sẻ công khai", app gọi `publishToFirebase()`. Khi tắt, gọi `unpublishFromFirebase()` để xóa dữ liệu. Đây là opt-in có ý thức — mặc định mọi cây đều private, không tự động upload.

```typescript
// firebase/plant-sync.ts
import { ref, set, remove, onValue, off } from 'firebase/database';
import { db } from './firebase-config';

// Schema path: plantcraft-public/{ownerUid}/{plantId}
// Phân cấp theo ownerUid trước để Firebase Security Rules dễ viết

interface SharedPlacedItem {
  id: string;
  itemId: string;                         // key trong ITEM_REGISTRY — viewer cần để load đúng GLTF
  qrRelativePosition: { x: number; y: number; z: number };
  qrRelativeRotation: { x: number; y: number; z: number; w: number };
  qrRelativeScale:    { x: number; y: number; z: number };
}

interface PublicPlantData {
  name: string;
  hp: number;
  species?: string;
  placedItems: SharedPlacedItem[];        // ← thay thế placedItemIds (chỉ lưu id) bằng full data
  lastUpdated: number;
}

export async function publishToFirebase(
  plant: Plant,
  ownerUid: string
): Promise<void> {
  const path = `plantcraft-public/${ownerUid}/${plant.id}`;

  // Chỉ push các item đã được đặt trong QR Anchor mode (có qrRelativePosition)
  // Item đặt ở chế độ camera-relative không có ý nghĩa với viewer
  const sharedItems: SharedPlacedItem[] = plant.placedItems
    .filter(item => item.coordinateSpace === 'qr' && item.qrRelativePosition)
    .map(item => ({
      id:                 item.id,
      itemId:             item.itemId,
      qrRelativePosition: item.qrRelativePosition!,
      qrRelativeRotation: item.qrRelativeRotation!,
      qrRelativeScale:    item.qrRelativeScale ?? { x: 0.3, y: 0.3, z: 0.3 },
    }));

  const data: PublicPlantData = {
    name:        plant.name,
    hp:          plant.hp,
    species:     plant.species,
    placedItems: sharedItems,
    lastUpdated: Date.now(),
  };
  await set(ref(db, path), data);
}

// Gọi ngay sau khi owner đặt một item mới trong QR Anchor mode —
// thêm item vào Firebase mà không cần overwrite toàn bộ plant data
export async function syncPlacedItemToFirebase(
  plantId: string,
  ownerUid: string,
  item: PlacedItem
): Promise<void> {
  if (!item.qrRelativePosition) return; // guard: chỉ sync QR-relative items

  const sharedItem: SharedPlacedItem = {
    id:                 item.id,
    itemId:             item.itemId,
    qrRelativePosition: item.qrRelativePosition,
    qrRelativeRotation: item.qrRelativeRotation!,
    qrRelativeScale:    item.qrRelativeScale ?? { x: 0.3, y: 0.3, z: 0.3 },
  };

  // Ghi vào path riêng cho từng item — tránh overwrite items khác đang được đồng bộ đồng thời
  const path = `plantcraft-public/${ownerUid}/${plantId}/placedItems/${item.id}`;
  await set(ref(db, path), sharedItem);
}

// Xóa một item khỏi Firebase khi owner remove nó trong AR
export async function removeSharedItemFromFirebase(
  plantId: string,
  ownerUid: string,
  itemInstanceId: string
): Promise<void> {
  await remove(ref(db, `plantcraft-public/${ownerUid}/${plantId}/placedItems/${itemInstanceId}`));
}

export async function unpublishFromFirebase(
  plantId: string,
  ownerUid: string
): Promise<void> {
  await remove(ref(db, `plantcraft-public/${ownerUid}/${plantId}`));
}

// Gọi hàm này mỗi khi owner tưới nước, lau lá, hay chữa bệnh
// để HP trên Firebase luôn đồng bộ với LocalStorage
export async function syncHPToFirebase(
  plantId: string,
  ownerUid: string,
  newHP: number
): Promise<void> {
  const path = `plantcraft-public/${ownerUid}/${plantId}/hp`;
  await set(ref(db, path), newHP);
  await set(ref(db, `plantcraft-public/${ownerUid}/${plantId}/lastUpdated`), Date.now());
}
```

**Firebase Security Rules** — phải cấu hình trong Firebase Console trước khi deploy:

```json
{
  "rules": {
    "plantcraft-public": {
      "$ownerUid": {
        ".read": true,
        ".write": "auth !== null && auth.uid === $ownerUid"
      }
    }
  }
}
```

Giải thích logic: bất kỳ ai cũng có thể đọc (`.read: true`) vì đây là dữ liệu public theo ý người dùng. Nhưng chỉ người đang đăng nhập với đúng UID đó mới được ghi — ngăn viewer giả mạo HP của cây người khác.

### 5.3 Phía Viewer — Quét QR và Render Billboard Label

**File:** `src/components/ScanFriend/ScanFriendScreen.tsx`

Màn hình này dùng MindAR.js thay vì WebXR thuần, vì MindAR có sẵn QR detection và image tracking tích hợp, chạy tốt trên cả Android lẫn iOS Safari.

```html
<!-- Cấu trúc A-Frame cho ScanFriend — khác hoàn toàn với ARScene.tsx của chế độ cá nhân -->
<!-- MindAR.js được load qua CDN để lazy load, không ảnh hưởng initial bundle -->
<script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"></script>

<a-scene
  mindar-image="
    filterMinCF: 0.001;
    filterBeta: 0.001;
    missTolerance: 5;
    warmupTolerance: 3
  "
  color-space="sRGB"
  renderer="colorManagement: true"
  vr-mode-ui="enabled: false"
  device-orientation-permission-ui="enabled: false"
>
  <!-- MindAR dùng "image target" — QR code được treat như một ảnh cần nhận diện -->
  <!-- targets: URL đến file .mind được compile từ QR code mẫu -->
  <!-- Tuy nhiên với QR động (mỗi cây khác nhau), ta dùng approach khác: -->
  <!-- nhận diện QR bằng jsQR library trước, rồi dùng MindAR để track vị trí -->

  <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

  <!-- Billboard container — hiển thị sau khi QR được detect và dữ liệu đã fetch -->
  <a-entity id="plant-billboard" visible="false">

    <!-- Background panel mờ để text dễ đọc -->
    <a-plane
      width="0.5" height="0.22"
      color="#1A2E0A"
      opacity="0.75"
      position="0 0.05 0"
    ></a-plane>

    <!-- Tên cây — font pixel, text-anchor center -->
    <a-text
      id="plant-name-text"
      value="..."
      font="mozillavr"
      color="#E8F5E9"
      width="0.45"
      align="center"
      position="0 0.14 0.001"
      scale="0.6 0.6 0.6"
    ></a-text>

    <!-- HP số -->
    <a-text
      id="plant-hp-text"
      value="♥ --/100"
      color="#81C784"
      width="0.45"
      align="center"
      position="0 0.06 0.001"
      scale="0.45 0.45 0.45"
    ></a-text>

    <!-- HP Bar background (track) -->
    <a-plane
      id="hp-bar-track"
      width="0.38" height="0.025"
      color="#2E4A1E"
      position="0 -0.02 0.001"
    ></a-plane>

    <!-- HP Bar fill — width được set bằng JS theo giá trị HP thực -->
    <a-plane
      id="hp-bar-fill"
      width="0.38" height="0.025"
      color="#4CAF50"
      position="0 -0.02 0.002"
    ></a-plane>

    <!-- Icon trạng thái — thay đổi theo HP -->
    <a-text
      id="status-icon"
      value="✅"
      align="center"
      position="0 -0.07 0.001"
      scale="0.5 0.5 0.5"
    ></a-text>

  </a-entity>
</a-scene>
```

**Script xử lý QR detection + Firebase fetch + realtime update:**

```typescript
// src/ar/qr-anchor-manager.ts
import jsQR from 'jsqr';         // detect QR từ video frame
import { ref, onValue, off }    from 'firebase/database';
import { db }                   from '../firebase/firebase-config';

// Giải thích lý do dùng jsQR thay vì chỉ dùng MindAR:
// MindAR track VỊ TRÍ của image target trong 3D space.
// jsQR đọc NỘI DUNG của QR code.
// Hai việc khác nhau — ta cần cả hai: jsQR để lấy plantId, MindAR để biết đặt label ở đâu.

let firebaseUnsubscribe: (() => void) | null = null;

export function startQRScanning(videoElement: HTMLVideoElement): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // Scan mỗi 200ms — đủ nhanh để detect mà không tốn nhiều CPU
  const scanInterval = setInterval(() => {
    if (videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) return;

    canvas.width  = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrResult  = jsQR(imageData.data, canvas.width, canvas.height, {
      inversionAttempts: 'dontInvert',
    });

    if (!qrResult) return;

    // QR detected — thử parse payload
    try {
      const payload = JSON.parse(qrResult.data) as QRPayload;

      // Guard: chỉ xử lý QR của PlantCraft
      if (payload.app !== 'plantcraft' || !payload.plantId) return;

      // Dừng scan sau khi đã detect — không cần scan liên tục nữa
      clearInterval(scanInterval);

      // Bắt đầu fetch + realtime listener
      subscribeToPlant(payload.ownerUid, payload.plantId);

    } catch {
      // QR có nội dung khác, bỏ qua
    }
  }, 200);
}

function subscribeToPlant(ownerUid: string, plantId: string): void {
  const path = `plantcraft-public/${ownerUid}/${plantId}`;

  // Hủy listener cũ nếu đang theo dõi cây khác
  if (firebaseUnsubscribe) firebaseUnsubscribe();

  const plantRef = ref(db, path);

  // onValue fires ngay lập tức với data hiện tại, và mỗi khi data thay đổi
  const unsubscribe = onValue(plantRef, (snapshot) => {
    if (!snapshot.exists()) {
      showPrivateMessage(); // cây ở chế độ private
      return;
    }

    const data = snapshot.val() as PublicPlantData;
    updateBillboard(data); // cập nhật A-Frame entities
  });

  // Lưu hàm unsubscribe để gọi khi thoát màn hình
  firebaseUnsubscribe = () => off(plantRef, 'value', unsubscribe);
}

function updateBillboard(data: PublicPlantData): void {
  // Hiện billboard nếu đang ẩn
  const billboard = document.getElementById('plant-billboard');
  if (billboard) billboard.setAttribute('visible', 'true');

  // Cập nhật tên
  document.getElementById('plant-name-text')
    ?.setAttribute('value', `🌿 ${data.name}`);

  // Cập nhật HP số
  document.getElementById('plant-hp-text')
    ?.setAttribute('value', `♥ ${data.hp}/100`);

  // Cập nhật màu HP bar fill theo ngưỡng
  const hpColor = data.hp >= 70 ? '#4CAF50' : data.hp >= 40 ? '#FFC107' : '#F44336';
  const hpFill  = document.getElementById('hp-bar-fill');
  if (hpFill) {
    // Co lại width và shift position để fill từ trái sang phải
    const fillWidth = 0.38 * (data.hp / 100);
    const fillX     = (fillWidth - 0.38) / 2; // căn trái
    hpFill.setAttribute('width',    fillWidth.toString());
    hpFill.setAttribute('position', `${fillX} -0.02 0.002`);
    hpFill.setAttribute('color',    hpColor);
  }

  // Cập nhật icon trạng thái
  const icon   = data.hp >= 70 ? '✅' : data.hp >= 40 ? '⚠️' : '🚨';
  document.getElementById('status-icon')?.setAttribute('value', icon);
}

// Gọi khi component unmount để tránh memory leak
export function stopQRScanning(): void {
  if (firebaseUnsubscribe) {
    firebaseUnsubscribe();
    firebaseUnsubscribe = null;
  }
}
```

### 5.4 Firebase Config và Khởi Tạo

**File:** `src/firebase/firebase-config.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getDatabase }   from 'firebase/database';
import { getAuth }       from 'firebase/auth';

// Các giá trị này lấy từ Firebase Console → Project Settings → Your apps
// Lưu vào .env.local, KHÔNG commit lên GitHub
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db   = getDatabase(app);   // Realtime Database
export const auth = getAuth(app);       // Authentication (dùng cho Security Rules)
```

**File `.env.local` — thêm 7 biến mới bên cạnh Gemini API Key:**

```
VITE_GEMINI_API_KEY=...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=plantcraft-xxx.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://plantcraft-xxx-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=plantcraft-xxx
VITE_FIREBASE_STORAGE_BUCKET=plantcraft-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> **Chọn region `asia-southeast1` (Singapore)** khi tạo Realtime Database để latency thấp nhất cho người dùng Việt Nam.

### 5.5 Tích Hợp Với Gamification Store

Khi owner thực hiện hành động chăm sóc (waterPlant, wipePlant, curePlant), Zustand store cập nhật HP trong LocalStorage. Nếu cây đang ở Public Mode, cần sync đồng thời lên Firebase. Thêm side effect vào game-store.ts:

```typescript
// Bên trong waterPlant action trong game-store.ts — thêm đoạn sync này:
waterPlant: (plantId) => {
  // ... logic cũ: cập nhật HP trong LocalStorage ...

  // Sync lên Firebase nếu cây đang public
  const plant = get().plants.find(p => p.id === plantId);
  if (plant?.isPublic) {
    const ownerUid = auth.currentUser?.uid;
    if (ownerUid) {
      // Fire-and-forget — không await, không block UI
      syncHPToFirebase(plantId, ownerUid, Math.min(100, plant.hp + 20))
        .catch(err => console.warn('Firebase sync failed:', err));
    }
  }
},
```

### 5.6 Prompt Cho Cursor — QR Code Anchor + Shared Item Rendering

```
"Thêm tính năng QR Code Anchor vào PlantCraft. Chia thành 5 bước:

BƯỚC 1 — Firebase setup:
Tạo src/firebase/firebase-config.ts với initializeApp, getDatabase, getAuth.
Đọc config từ import.meta.env.VITE_FIREBASE_*. Export db và auth.
Firebase Security Rules: plantcraft-public/{ownerUid}/.read=true, .write='auth.uid===$ownerUid'.

BƯỚC 2 — Cập nhật PlacedItem interface:
Trong game.types.ts, thêm các fields: qrRelativePosition, qrRelativeRotation, qrRelativeScale,
coordinateSpace: 'camera' | 'qr', isShared: boolean vào PlacedItem interface.
Thêm isPublic: boolean vào Plant interface.

BƯỚC 3 — Owner tạo QR và Shared Mode:
Tạo PlantQRScreen.tsx (route /plant/:plantId/qr):
  - Dùng 'qrcode' lib tạo QR từ JSON {app:'plantcraft', plantId, ownerUid, version:1}.
  - Toggle 'Chia sẻ công khai' → publishToFirebase() (push name, hp, placedItems có
    coordinateSpace==='qr' lên Firebase path plantcraft-public/{uid}/{plantId}).
  - Nút 'Tải về PNG' dùng canvas.toBlob() + download link.
Trong ARScene.tsx / ARPlantHUD.tsx, thêm nút 'Quét QR để bật Shared Mode':
  - Khi tap: bật overlay nhỏ chạy jsQR scan. Khi detect QR của chính cây này:
    gọi setQRAnchorEntity(mindarImageTargetObject3D), đóng overlay,
    hiện banner '✅ Shared Mode đang bật'.
Trong placeSelectedItem(), khi activeQRAnchorEntity !== null:
  - Tính qrRelativePosition = activeQRAnchorEntity.worldToLocal(worldPos.clone()).
  - Tính qrRelativeRotation từ worldQuat.premultiply(qrQuat.clone().invert()).
  - Lưu PlacedItem với coordinateSpace:'qr', isShared:true.
  - Gọi syncPlacedItemToFirebase() fire-and-forget.

BƯỚC 4 — Viewer quét QR, thấy Billboard + Vật Phẩm:
Tạo ScanFriendScreen.tsx (route /scan-friend):
  A-Frame scene với mindar-image tracking.
  Cấu trúc quan trọng: <a-entity mindar-image-target='targetIndex: 0'>
    chứa #plant-billboard (tên + HP bar) VÀ #shared-items-container (GLTF items).
  Tất cả <a-assets> preload hết các GLTF trong ITEM_REGISTRY.
  jsQR scan video frame mỗi 200ms → parse plantId + ownerUid →
  subscribeToPlant(ownerUid, plantId) dùng Firebase onValue.
  Khi nhận data:
    - updateBillboard(data): cập nhật text tên, HP số, HP bar width/color, icon.
    - renderSharedItems(data.placedItems):
        Xóa container.innerHTML.
        Với mỗi item: tạo <a-entity gltf-model='#{itemId}-model'>
        set position từ qrRelativePosition (đã là local space của image-target entity).
        Convert quaternion sang euler degrees để set rotation attribute.
        Append vào #shared-items-container.
  Khi unmount: gọi off() để hủy Firebase listener.

BƯỚC 5 — Sync khi owner thay đổi:
Trong game-store.ts waterPlant/wipePlant/curePlant: nếu plant.isPublic,
gọi syncHPToFirebase() fire-and-forget.
Thêm '🔍 Quét bạn' vào BottomNav dẫn đến /scan-friend.
Giữ nguyên toàn bộ code hiện có — QR Anchor là layer độc lập."
```

### 5.8 Phía Viewer — Render Vật Phẩm Ảo Của Owner

Đây là phần kỹ thuật thú vị nhất của toàn bộ tính năng Shared AR. Thay vì phải tự tính ma trận biến đổi tọa độ phức tạp, ta tận dụng một đặc điểm của hệ phân cấp entity trong A-Frame/THREE.js: **entity con tự động kế thừa transform của entity cha**. Điều này có nghĩa là nếu ta đặt tất cả GLTF items làm con của entity `mindar-image-target` (entity tự động track QR code trong 3D), chúng sẽ "dính" theo QR code khi camera di chuyển mà không cần thêm một dòng code nào.

Hãy hình dung như này: QR code là "bệ phóng", và tất cả vật phẩm được đặt cố định trên bệ phóng đó. Khi camera nhìn thấy bệ phóng ở góc nào, các vật phẩm cũng xuất hiện đúng góc đó so với bệ phóng.

**Cấu trúc A-Frame Scene cho ScanFriendScreen (cập nhật):**

```html
<a-scene
  mindar-image="
    filterMinCF: 0.001;
    filterBeta: 0.001;
    missTolerance: 5;
    warmupTolerance: 3
  "
  embedded
  color-space="sRGB"
  renderer="colorManagement: true"
  vr-mode-ui="enabled: false"
>
  <!-- Asset registry: preload TẤT CẢ GLTF models có thể xuất hiện -->
  <!-- Cần load hết vì viewer không biết trước owner đặt item nào -->
  <a-assets>
    <a-asset-item id="hat_grass-model"       src="/assets/models/hat_grass.gltf"></a-asset-item>
    <a-asset-item id="glasses_sunflower-model" src="/assets/models/glasses_sunflower.gltf"></a-asset-item>
    <a-asset-item id="block_diamond-model"   src="/assets/models/block_diamond.gltf"></a-asset-item>
    <a-asset-item id="vfx_butterflies-model" src="/assets/models/butterflies.gltf"></a-asset-item>
    <!-- ... tất cả items trong ITEM_REGISTRY ... -->
  </a-assets>

  <!-- ĐÂY LÀ ENTITY QUAN TRỌNG NHẤT: track QR code trong 3D space -->
  <!-- targetIndex: 0 = QR code đầu tiên trong danh sách targets -->
  <a-entity id="qr-anchor-target" mindar-image-target="targetIndex: 0">

    <!-- Billboard HUD: tên cây + HP bar — luôn hiện khi QR visible -->
    <a-entity id="plant-billboard" position="0 0.15 0">
      <a-plane width="0.5" height="0.22" color="#1A2E0A" opacity="0.75"></a-plane>
      <a-text id="plant-name-text" value="..." color="#E8F5E9"
              width="0.45" align="center" position="0 0.07 0.001" scale="0.55 0.55 0.55"></a-text>
      <a-text id="plant-hp-text"   value="♥ --/100" color="#81C784"
              width="0.45" align="center" position="0 0 0.001"   scale="0.4 0.4 0.4"></a-text>
      <a-plane id="hp-bar-track"  width="0.38" height="0.02" color="#2E4A1E" position="0 -0.06 0.001"></a-plane>
      <a-plane id="hp-bar-fill"   width="0.38" height="0.02" color="#4CAF50" position="0 -0.06 0.002"></a-plane>
      <a-text  id="status-icon"   value="✅" align="center"   position="0 -0.1 0.001" scale="0.45 0.45 0.45"></a-text>
    </a-entity>

    <!-- Container cho các vật phẩm ảo của owner -->
    <!-- Items sẽ được inject động bằng JS khi fetch từ Firebase -->
    <!-- Vì là con của #qr-anchor-target, chúng TỰ ĐỘNG theo QR -->
    <a-entity id="shared-items-container"></a-entity>

  </a-entity>

  <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
</a-scene>
```

**Hàm `renderSharedItems()` — inject GLTF entities từ Firebase data:**

```typescript
// Thêm vào qr-anchor-manager.ts

/**
 * Xóa tất cả shared items cũ và render lại từ dữ liệu Firebase mới nhất.
 * Gọi hàm này mỗi khi Firebase listener nhận được update từ owner.
 *
 * @param items - Mảng SharedPlacedItem từ Firebase snapshot
 */
function renderSharedItems(items: SharedPlacedItem[]): void {
  const container = document.getElementById('shared-items-container');
  if (!container) return;

  // Xóa toàn bộ items cũ trước khi render lại
  // Dùng innerHTML = '' nhanh hơn loop removeChild()
  container.innerHTML = '';

  items.forEach(item => {
    const { qrRelativePosition: pos, qrRelativeRotation: rot, qrRelativeScale: scale } = item;

    // Kiểm tra item có trong ITEM_REGISTRY không
    // (đề phòng owner có item viewer chưa download model)
    if (!ITEM_REGISTRY[item.itemId]) {
      console.warn(`Item ${item.itemId} not found in ITEM_REGISTRY — skipping`);
      return;
    }

    const entity = document.createElement('a-entity');

    // GLTF model — dùng id pattern `${itemId}-model` khớp với <a-assets> ở trên
    entity.setAttribute('gltf-model', `#${item.itemId}-model`);

    // Position tương đối với QR entity — đây là giá trị đã tính từ phía owner
    entity.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);

    // Rotation dạng quaternion → A-Frame dùng euler degrees, cần convert
    // THREE.js Euler từ Quaternion:
    const euler = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w),
      'YXZ'  // thứ tự Euler phổ biến trong game engines
    );
    entity.setAttribute('rotation',
      `${THREE.MathUtils.radToDeg(euler.x)} ${THREE.MathUtils.radToDeg(euler.y)} ${THREE.MathUtils.radToDeg(euler.z)}`
    );

    entity.setAttribute('scale', `${scale.x} ${scale.y} ${scale.z}`);

    // Data attribute để có thể tìm lại entity nếu cần update sau
    entity.dataset.sharedItemId = item.id;

    container.appendChild(entity);
  });
}

// Cập nhật subscribeToPlant() để gọi renderSharedItems() khi nhận data
function subscribeToPlant(ownerUid: string, plantId: string): void {
  const path = `plantcraft-public/${ownerUid}/${plantId}`;
  if (firebaseUnsubscribe) firebaseUnsubscribe();

  const plantRef = ref(db, path);
  const unsubscribe = onValue(plantRef, (snapshot) => {
    if (!snapshot.exists()) { showPrivateMessage(); return; }

    const data = snapshot.val() as PublicPlantData;

    // Cập nhật Billboard HUD (HP + tên) — như cũ
    updateBillboard(data);

    // MỚI: Render toàn bộ vật phẩm ảo của owner
    // Firebase listener fire mỗi khi owner thêm/xóa item → viewer thấy ngay
    if (data.placedItems) {
      // Convert Firebase object sang array (Firebase lưu object với key là item.id)
      const itemsArray = Object.values(data.placedItems) as SharedPlacedItem[];
      renderSharedItems(itemsArray);
    }
  });

  firebaseUnsubscribe = () => off(plantRef, 'value', unsubscribe);
}
```

**Luồng UX cho Owner khi dùng QR Anchor mode để đặt item:**

Đây là bước owner cần thực hiện trước khi đặt vật phẩm để hệ thống tính được tọa độ tương đối với QR. Nếu bỏ qua bước này, `activeQRAnchorEntity` sẽ là `null` và item sẽ được lưu ở chế độ `camera-relative` — không chia sẻ được.

```
Owner mở AR screen → HUD hiện banner "📷 Quét QR của cây để bật Shared Mode" →
Owner hướng camera vào QR dán trên chậu → MindAR detect QR →
setQRAnchorEntity(qrEntity) gọi → Banner đổi thành "✅ Đã khóa vị trí QR" →
Owner chọn item trong carousel → Tap lên cây →
placeSelectedItem() chạy với activeQRAnchorEntity !== null →
worldToLocal() tính qrRelativePosition → PlacedItem lưu với coordinateSpace: 'qr' →
syncPlacedItemToFirebase() push lên Firebase ngay lập tức →
Viewer đang scan QR nhận Firebase update → renderSharedItems() chạy →
Item mới xuất hiện trên màn hình viewer
```

**Vấn đề MindAR target file cho QR động:**

MindAR thông thường yêu cầu compile một file `.mind` từ ảnh tĩnh trước. Nhưng QR của mỗi cây khác nhau nên không thể compile sẵn. Giải pháp là dùng MindAR ở chế độ **generic QR tracking** (dùng jsQR để detect nội dung) kết hợp với một **tấm target ảnh cố định** (ví dụ logo PlantCraft) để MindAR lấy pose, sau đó dùng vị trí tương đối từ QR text content để xác định plantId. Cách triển khai cụ thể:

```typescript
// Khởi tạo MindAR với một ảnh target cố định (logo PlantCraft)
// File này được compile sẵn một lần và không đổi
const mindAR = new MindARThree({
  container: containerEl,
  imageTargetSrc: '/assets/plantcraft-qr-target.mind',
  // File .mind này được tạo từ một QR mẫu bất kỳ —
  // MindAR sẽ track bất kỳ QR code nào có cùng cấu trúc vuông vức
});

// Khi MindAR detect target, ta lấy pose từ đó
// Đồng thời jsQR đọc nội dung để lấy plantId
// Hai nguồn thông tin này bổ sung cho nhau:
// jsQR  → "đây là cây của ai?"
// MindAR → "tờ giấy này đang ở đâu trong không gian 3D?"
```

---

### 5.9 Owner Flow — Bước Quét QR Trong ARScene.tsx

Đây là thay đổi cần thêm vào màn hình AR cá nhân của owner (không phải ScanFriendScreen). Owner cần một nút để kích hoạt chế độ quét QR của chính mình trước khi đặt vật phẩm.

```tsx
// Thêm vào ARPlantHUD — phần dưới cùng của HUD top bar
{!isQRAnchored ? (
  <button
    onClick={startOwnerQRScan}
    style={{
      background: '#5C8A3C',
      color: 'white',
      padding: '6px 12px',
      borderRadius: 4,
      fontSize: 10,
      fontFamily: '"Press Start 2P"',
      marginTop: 8,
      width: '100%',
    }}
  >
    📷 Quét QR để bật Shared Mode
  </button>
) : (
  <div style={{ color: '#81C784', fontSize: 9, marginTop: 8, textAlign: 'center' }}>
    ✅ Shared Mode — vật phẩm sẽ hiển thị cho bạn bè
  </div>
)}
```

Khi `startOwnerQRScan()` được gọi, một overlay nhỏ (50% màn hình) hiện lên với jsQR chạy để quét QR. Sau khi detect QR của chính cây đó (`payload.plantId === activePlantId`), overlay đóng lại, `setQRAnchorEntity()` được gọi với pose của QR từ MindAR, và owner có thể bắt đầu đặt vật phẩm ở chế độ Shared.

**Billboard không "dính" vào cây khi di chuyển:** MindAR track QR code liên tục, nên Billboard Label sẽ đi theo QR trong không gian. Nhưng nếu QR bị che khuất (ví dụ người dùng đưa tay qua), label sẽ biến mất tạm thời. Đây là hành vi đúng — label chỉ hiện khi camera thấy QR. Cần thông báo người dùng về điều này trong onboarding.

**jsQR vs camera resolution:** Trên các điện thoại giá rẻ, video resolution thấp khiến QR nhỏ khó detect. Giải pháp: thêm hướng dẫn "Đưa camera cách QR khoảng 15–30cm để quét tốt nhất."

**Firebase free tier (Spark):** Giới hạn 100 concurrent connections và 1GB storage/tháng — hoàn toàn đủ cho demo và giai đoạn beta. Khi scale lên cần nâng lên Blaze plan.

---

## 7. CẤU TRÚC FILE DỰ ÁN

```
plantcraft/
├── public/
│   ├── assets/
│   │   ├── models/          # .gltf voxel models (hat, glasses, blocks)
│   │   ├── previews/        # .png isometric previews cho shop
│   │   └── reticle.gltf     # vòng tròn hit-test indicator
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── PlantCard.tsx
│   │   │   ├── HPBar.tsx
│   │   │   └── AddPlantModal.tsx
│   │   ├── Shop/
│   │   │   ├── ItemGrid.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   └── ItemDetailSheet.tsx
│   │   ├── AR/
│   │   │   ├── ARScene.tsx          # A-Frame scene cá nhân (hit-test + DOM Overlay HUD)
│   │   │   ├── ARPlantHUD.tsx       # HP bar + tên cây float trên AR
│   │   │   ├── ItemCarousel.tsx     # Thanh chọn item bên dưới
│   │   │   └── ScanButton.tsx
│   │   ├── QR/
│   │   │   └── PlantQRScreen.tsx    # Tạo QR + toggle Public Mode (route: /plant/:id/qr)
│   │   ├── ScanFriend/
│   │   │   └── ScanFriendScreen.tsx # Quét QR bạn + Billboard Label (route: /scan-friend)
│   │   ├── RewardToast.tsx
│   │   └── BottomNav.tsx
│   ├── ar/
│   │   ├── hit-test-component.js    # A-Frame custom component
│   │   ├── ar-manager.ts
│   │   └── qr-anchor-manager.ts    # jsQR scan + Firebase listener + updateBillboard()
│   ├── firebase/
│   │   ├── firebase-config.ts       # initializeApp, export db + auth
│   │   └── plant-sync.ts            # publishToFirebase, unpublishFromFirebase, syncHPToFirebase
│   ├── ai/
│   │   └── diagnose-plant.ts
│   ├── store/
│   │   └── game-store.ts            # Zustand store (thêm isPublic vào Plant, side-effect sync)
│   ├── data/
│   │   └── item-registry.ts
│   ├── types/
│   │   └── game.types.ts            # Thêm QRPayload, PublicPlantData interface
│   ├── App.tsx
│   └── main.tsx
├── .env.local                       # VITE_GEMINI_API_KEY + 7 VITE_FIREBASE_* keys
├── vite.config.ts
└── tailwind.config.ts
```

---

## 8. LUỒNG NGƯỜI DÙNG (User Flows)

### Flow 1: Lần đầu sử dụng
```
Mở app → Dashboard trống → Tap "Thêm cây" → Nhập tên → Chụp ảnh → 
Plant card xuất hiện (HP: 100, trạng thái ✅) → Nhận 50 XP khởi đầu
```

### Flow 2: Chăm sóc hàng ngày
```
Mở app → updateHP() chạy tự động → HP đã giảm xuống 60 → 
Tap "Tưới nước" trên card → HP +20, XP +10 → Toast "+10 XP" bay lên
```

### Flow 3: Chẩn đoán và chữa bệnh (Flow quan trọng nhất)
```
Tap "📷 Camera" → Màn hình AR mở → Hướng vào lá vàng → 
Tap "🔍 Quét bệnh AI" → captureARFrame() → diagnosePlant() → 
Loading spinner 2-3s → Modal kết quả: "Thiếu Nitơ — Mức độ: Trung bình"
→ Hiển thị 3 bước điều trị → Lưu pendingDiagnosis vào plant
→ Sau 3 ngày user chụp lại ảnh lá xanh → curePlant() → +100 GC 🎉
```

### Flow 4: Trang trí AR
```
Tap "AR Trang Trí" trên plant card → Màn hình AR mở →
Chọn item trong carousel bên dưới (ví dụ: Mũ Cỏ Xanh) →
Di chuyển điện thoại cho reticle rơi lên cành cây →
Tap màn hình → placeSelectedItem() → Item xuất hiện trong không gian →
savePlacedItem() lưu vào LocalStorage
```

### Flow 5: Mua vật phẩm
```
Tap "🏪 Shop" → Browse items → Tap item "Kính Hoa Hướng Dương (120 GC)" →
Bottom sheet mở → Tap "Mua ngay" → purchaseItem() kiểm tra coins → 
Coins đủ → coins -= 120, item thêm vào inventory → Toast "Mua thành công!"
```

### Flow 6: Chia sẻ cây cho người khác xem qua QR (Owner)
```
Tap Plant Card → Tap "📤 Chia sẻ QR" → Màn hình /plant/:id/qr mở →
QR code hiển thị to giữa màn hình (chứa plantId + URL deeplink) →
Toast "Bật Public Mode để người khác thấy HP thật nhé!" →
Toggle "Public" → publishToFirebase(plant) →
Đưa điện thoại cho bạn hoặc in QR dán lên chậu
```

### Flow 7: Xem cây của bạn bè qua QR (Viewer)
```
Tap "🔍 Quét bạn" trên bottom nav → Màn hình /scan-friend mở →
MindAR.js khởi động, camera bật → Hướng vào QR code trên chậu cây →
MindAR nhận diện QR → parse plantId → fetchPlantFromFirebase(plantId) →
Billboard Label xuất hiện ngay trên QR: "🌿 Cây Sen Đá — ♥ 72/100" →
HP bar 3D render bên dưới tên → Firebase listener theo dõi realtime →
Nếu chủ cây tưới nước lúc này, HP bar của viewer cập nhật ngay lập tức
```

---

## 9. XỬ LÝ LỖI VÀ EDGE CASES

**LocalStorage đầy:** Wrap tất cả `localStorage.setItem` trong try-catch. Nếu `QuotaExceededError` → xóa `rewardHistory` cũ, nén `thumbnailBase64` xuống quality thấp hơn, thông báo user.

**Gemini API timeout:** Timeout sau 15 giây. Hiển thị "AI đang bận, thử lại sau" thay vì crash. Không trừ lần quét.

**WebXR không hỗ trợ:** Xem mục 4.5. Fallback `'limited'` vẫn cho phép user xem camera và tap để overlay item ảo (không có hit-test thực).

**Ảnh chụp quá tối/mờ:** Gemini sẽ trả về `confidence < 0.4` hoặc `{ "error": "..." }`. Hiển thị "Ảnh chưa đủ sáng rõ — hãy thử chụp gần hơn hoặc ra ngoài sáng."

**HP về 0:** Plant card chuyển sang màu đỏ, badge "💀 Cần cứu ngay!", shake animation. KHÔNG xóa cây — user vẫn có thể tưới để hồi sinh.

**QR code bị che khuất hoặc nhòe:** MindAR.js không detect được → Billboard Label không xuất hiện. Hiển thị text hướng dẫn "Đưa camera lại gần QR, đảm bảo đủ sáng" sau 3 giây không detect được.

**Cây ở chế độ Private (chưa bật Public Mode):** Firebase trả về `null` hoặc `permission denied`. Hiển thị modal "Chủ cây chưa chia sẻ công khai — hãy nhờ họ bật Public Mode trong app."

**Firebase offline / mất mạng khi xem cây bạn:** Hiển thị dữ liệu cached lần cuối cùng với badge "📵 Offline — dữ liệu có thể chưa cập nhật". Billboard Label vẫn render để không làm vỡ trải nghiệm AR.

**Firebase write conflict (hai người cùng cập nhật HP):** Dùng Firebase Transaction để tránh race condition. Chỉ owner của cây (`uid` khớp) mới được phép write vào `hp` field — viewers chỉ có read permission.

---

## 10. TIÊU CHÍ HOÀN THÀNH (Definition of Done)

| Feature | Kiểm tra thế nào |
|---|---|
| Dashboard hiển thị HP bar | HP giảm 4 điểm/giờ, hiển thị đúng màu |
| Thêm cây được | Sau khi thêm, card xuất hiện ngay, persist sau F5 |
| Tưới nước +10 XP | Console log + toast, LocalStorage có entry mới |
| Shop load items | 5+ items hiển thị, filter tab hoạt động |
| Mua item trừ coins | coins giảm đúng, item vào inventory, không được mua khi hết tiền |
| AR mở được camera | `getUserMedia` cấp phép, camera hiển thị fullscreen |
| Đặt item vào AR | Tap → item GLTF xuất hiện đúng vị trí, không bị trôi trong 30s |
| AI scan trả kết quả | JSON đúng format, treatments có đúng 3 bước |
| Cure disease +100 GC | Sau curePlant(), coins +100 trong store và LocalStorage |
| Data persist sau reload | Mở tab mới, tất cả plants + coins còn nguyên |
| AR HUD hiển thị | Tên cây + HP bar luôn visible trong AR, màu đổi theo ngưỡng HP |
| HUD HP bar realtime | Sau khi tưới nước trong app, HP bar trong AR cập nhật ngay (Zustand reactive) |
| Education Mode toggle | Chuyển sang Edu Mode → xuất hiện nhiệm vụ lớp học thay thế free-play |
| QR code tạo được | Vào /plant/:id/qr → QR hiển thị, nút tải về hoạt động, scan QR decode đúng plantId |
| Public Mode publish | Bật toggle Public → data ghi lên Firebase, kiểm tra trong Firebase Console |
| MindAR detect QR | Mở /scan-friend, hướng vào QR → Billboard Label xuất hiện trong ≤ 2 giây |
| Billboard Label realtime | Chủ cây tưới nước → HP bar trên màn hình viewer cập nhật trong ≤ 1 giây |
| Owner QR Anchor mode | Owner quét QR → banner "✅ Shared Mode" xuất hiện, `activeQRAnchorEntity` không null |
| Item lưu QR-relative | Đặt item khi Shared Mode bật → PlacedItem có `coordinateSpace: 'qr'` và `qrRelativePosition` |
| Item sync Firebase | Sau khi đặt item → Firebase path `placedItems/{id}` có data trong ≤ 2 giây |
| Viewer thấy item | Viewer quét QR → tất cả GLTF items render đúng vị trí tương đối với tờ giấy QR |
| Item theo QR khi di chuyển | Xoay điện thoại viewer 90° → items vẫn "dính" lên cây, không drift |
| Item sync realtime | Owner đặt item mới → viewer đang quét thấy item xuất hiện mà không cần reload |
| Remove item sync | Owner xóa item trong AR → biến mất khỏi màn hình viewer trong ≤ 2 giây |
| Permission guard | Viewer không thể write vào Firebase của cây người khác (test bằng Postman) |

---

## 11. EDUCATION MODE — Mở Rộng Sang Trường Học

### 11.1 Bối Cảnh và Nhu Cầu

Nhiều trường học tại Việt Nam tổ chức các hoạt động trồng cây theo nhóm: trồng cây ngày môi trường, câu lạc bộ xanh, chậu cây của lớp, hay tiết Sinh học thực hành về quan sát sự phát triển của thực vật. Vấn đề chung là thiếu công cụ số hóa quá trình theo dõi — học sinh ghi chép bằng tay, giáo viên không có cách nào biết cây có được chăm sóc đúng không, và hoạt động thường mất hứng sau tuần đầu tiên vì không có phần thưởng hay cạnh tranh.

PlantCraft giải quyết vấn đề này bằng cách thêm một "Education Mode" kích hoạt được bằng một toggle trong Settings, biến cùng một ứng dụng thành công cụ học tập có cấu trúc.

### 11.2 Các Tính Năng Của Education Mode

**Class Code — Mã Lớp Học:**

Giáo viên tạo một `classCode` 6 ký tự (ví dụ: `XANH01`) và chia sẻ cho cả lớp. Học sinh nhập code này khi bật Education Mode. Dữ liệu của toàn lớp được sync qua một lightweight backend (Firebase Realtime Database — thêm ở giai đoạn sau MVP, không ảnh hưởng đến LocalStorage core).

**Mission Board — Bảng Nhiệm Vụ Lớp:**

Thay thế free-play bằng danh sách nhiệm vụ tuần có deadline, ví dụ: "Tưới cây mỗi ngày trong 7 ngày liên tiếp (+200 XP)", "Chẩn đoán và chữa khỏi 1 bệnh cho cây (+500 XP)", "Chụp ảnh cây vào thứ Hai và thứ Sáu để quan sát sự thay đổi (+50 XP mỗi lần)". Nhiệm vụ này được giáo viên thiết lập từ một trang /teacher-dashboard đơn giản.

**Class Leaderboard — Bảng Xếp Hạng Lớp:**

Hiển thị top XP của từng học sinh trong lớp (ẩn danh nếu học sinh muốn). Cơ chế này khai thác social motivation — người ta chăm cây chăm hơn khi biết bạn bè đang nhìn. Leaderboard reset theo tuần để học sinh cuối bảng không nản lòng.

**Plant Journal — Nhật Ký Sinh Học:**

Mỗi lần học sinh chụp ảnh lá và AI chẩn đoán, kết quả được lưu vào một "Plant Journal" dạng timeline. Học sinh có thể xuất Journal thành PDF để nộp như bài tập thực hành môn Sinh học — đây là điểm kết nối trực tiếp với chương trình học chính thức.

### 11.3 Data Model Bổ Sung Cho Education Mode

```typescript
interface ClassSession {
  classCode: string;           // 6 ký tự, do giáo viên tạo
  className: string;           // "Lớp 10A2 — Trường THPT ABC"
  teacherName: string;
  weeklyMissions: Mission[];
  leaderboard: LeaderboardEntry[];
  createdAt: number;
}

interface Mission {
  id: string;
  title: string;               // "Tưới cây 7 ngày liên tiếp"
  description: string;
  xpReward: number;
  deadline: number;            // timestamp
  type: 'streak_water' | 'cure_disease' | 'photo_journal' | 'scan_ai';
  requiredCount: number;       // số lần cần hoàn thành
}

interface PlantJournalEntry {
  id: string;
  plantId: string;
  photoBase64: string;         // ảnh lá chụp lúc scan
  diagnosisResult: DiagnosisResult;
  studentNote: string;         // học sinh tự ghi chú quan sát
  recordedAt: number;
}

// Thêm vào PlayerState:
interface PlayerState {
  // ... (các fields cũ)
  educationMode: boolean;
  classCode?: string;
  plantJournal: PlantJournalEntry[];
  completedMissions: string[];  // mảng mission id đã hoàn thành
}
```

### 11.4 Prompt Bổ Sung Cho Cursor — Education Mode

```
"Thêm Education Mode vào PlantCraft. Yêu cầu:
1. Trong Settings, thêm toggle 'Chế độ Lớp học' + input nhập classCode.
2. Khi Education Mode = true, màn hình Dashboard hiển thị thêm section
   'Nhiệm vụ tuần này' với danh sách Mission cards có progress bar.
3. Mỗi khi diagnosePlant() trả kết quả, tự động tạo PlantJournalEntry
   và lưu vào store. Thêm trang /journal/{plantId} hiển thị timeline ảnh.
4. Thêm trang /leaderboard hiển thị danh sách học sinh trong cùng classCode,
   sort theo XP, highlight entry của user hiện tại.
Giữ nguyên toàn bộ logic LocalStorage và Zustand store hiện có — Education
Mode chỉ là một layer thêm lên, không phá vỡ Consumer Mode."
```

### 11.5 Lộ Trình Tích Hợp Với Nhà Trường

Về ngắn hạn (giai đoạn MVP + 1 tháng), PlantCraft có thể tiếp cận trực tiếp câu lạc bộ môi trường và giáo viên Sinh học thông qua demo tại trường. Không cần phê duyệt sở giáo dục vì đây là công cụ tự nguyện, không thay thế chương trình chính thức. Về dài hạn, Plant Journal có thể được tích hợp vào hệ thống chấm điểm điện tử của trường nếu có API kết nối — đây là con đường để PlantCraft trở thành EdTech có doanh thu từ trường học (B2B) thay vì chỉ phụ thuộc vào IAP (B2C).

---

*Bản đặc tả này được viết để tối ưu cho Vibe Coding workflow: mỗi section là một prompt độc lập cho Lovable, v0, hoặc Cursor. Đọc từng giai đoạn theo thứ tự 1→5 để build sản phẩm hoàn chỉnh. MVP (Giai đoạn 1–4) có thể hoàn thành trong một buổi hackathon. Education Mode (mục 11) là Phase 2. QR Code Anchor (mục 5) là Phase 3 — cần Firebase setup trước, build song song với Education Mode.*
