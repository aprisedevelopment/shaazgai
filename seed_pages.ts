import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const pages = [
  {
    title: 'Үйлчилгээний нөхцөл',
    purl: 'terms',
    body: `
<h2>1. Нийтлэг үндэслэл</h2>
<p>Энэхүү үйлчилгээний нөхцөл нь "Түгээлт.мн" цахим худалдааны системээр дамжуулан бараа бүтээгдэхүүн худалдан авах, худалдахтай холбогдон гарах харилцааг зохицуулна.</p>
<p>Хэрэглэгч нь системийг ашиглахаас өмнө энэхүү нөхцөлтэй танилцаж, хүлээн зөвшөөрсөн байх шаардлагатай.</p>

<h2>2. Захиалга ба Хүргэлт</h2>
<ul>
  <li>Захиалга баталгаажсанаас хойш 24-48 цагийн дотор хүргэгдэнэ.</li>
  <li>Хүргэлтийн хаяг болон утасны дугаараа үнэн зөв оруулах шаардлагатай.</li>
  <li>Онцгой нөхцөл байдлын үед (цаг агаарын байдал, хөл хорио гэх мэт) хүргэлтийн хугацаа хойшилж болно.</li>
</ul>

<h2>3. Бараа буцаалт</h2>
<p>Худалдан авсан барааг хүлээн авсан өдрөөс хойш 3 хоногийн дотор доорх нөхцөлөөр буцаах боломжтой:</p>
<ul>
  <li>Барааны сав баглаа боодол гэмтээгүй байх</li>
  <li>Ашиглаагүй, өмсөөгүй байх</li>
  <li>Үйлдвэрийн гэмтэлтэй тохиолдолд шууд солих эсвэл буцаалт хийнэ.</li>
</ul>

<h2>4. Нууцлал ба Аюулгүй байдал</h2>
<p>Хэрэглэгчийн хувийн мэдээллийг чандлан нууцлах бөгөөд зөвхөн хүргэлт, төлбөр тооцооны зорилгоор ашиглана.</p>
    `,
    publish: 1,
    list_order: 1
  },
  {
    title: 'Төлбөр төлөлт',
    purl: 'tolbor',
    body: `
<h2>Төлбөрийн боломжууд</h2>
<p>Та манай цахим дэлгүүрээс худалдан авалт хийхдээ дараах төлбөрийн аргуудаас сонгох боломжтой:</p>

<h3>1. QPay (Шууд төлөлт)</h3>
<p>Монголын бүх банкны аппликейшн ашиглан QR код уншуулж төлбөрөө шилжүүлэх боломжтой. Төлбөр хийгдсэн даруйд захиалга автоматаар баталгаажна.</p>

<h3>2. SocialPay</h3>
<p>Голомт банкны SocialPay аппликейшн ашиглан хурдан шуурхай, шимтгэлгүй төлбөр хийх боломжтой.</p>

<h3>3. Storepay (Хуваан төлөх)</h3>
<p>Та барааны нийт үнийн дүнг 4 хувааж, хүүгүй, шимтгэлгүйгээр төлөх боломжтой. Storepay аппликейшн суулгасан байх шаардлагатай.</p>

<h3>4. Дансаар шилжүүлэх</h3>
<p>Манай компанийн албан ёсны данс руу шилжүүлэг хийх боломжтой. Гүйлгээний утга дээр <strong>ЗАХИАЛГЫН ДУГААР</strong>-аа заавал бичнэ үү.</p>
<div style="background: rgba(0,0,0,0.05); padding: 16px; border-radius: 8px; margin-top: 12px;">
  <strong>Хүлээн авагч:</strong> Түгээлт ХХК<br/>
  <strong>Хаан банк:</strong> 5000 0000 00<br/>
  <strong>Голомт банк:</strong> 1100 0000 00<br/>
</div>
    `,
    publish: 1,
    list_order: 2
  },
  {
    title: 'Холбоо барих',
    purl: 'contact',
    body: `
<h2>Бидэнтэй холбогдох</h2>
<p>Танд асуух зүйл гарвал доорх сувгуудаар бидэнтэй холбогдоно уу. Бид танд туслахад үргэлж бэлэн байна.</p>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-top: 24px;">
  <div style="border: 1px solid var(--border); padding: 24px; border-radius: 12px; text-align: center;">
    <div style="font-size: 32px; color: var(--primary); margin-bottom: 16px;">📞</div>
    <h3 style="margin-bottom: 8px;">Утас</h3>
    <p style="font-size: 18px; font-weight: 600;">7595-5050</p>
    <p style="color: var(--text-muted); font-size: 13px;">Даваа - Бямба, 09:00 - 18:00</p>
  </div>
  
  <div style="border: 1px solid var(--border); padding: 24px; border-radius: 12px; text-align: center;">
    <div style="font-size: 32px; color: var(--primary); margin-bottom: 16px;">📧</div>
    <h3 style="margin-bottom: 8px;">И-мэйл</h3>
    <p style="font-size: 18px; font-weight: 600;">info@tugeelt.mn</p>
    <p style="color: var(--text-muted); font-size: 13px;">sales@tugeelt.mn</p>
  </div>
  
  <div style="border: 1px solid var(--border); padding: 24px; border-radius: 12px; text-align: center;">
    <div style="font-size: 32px; color: var(--primary); margin-bottom: 16px;">📍</div>
    <h3 style="margin-bottom: 8px;">Хаяг</h3>
    <p style="font-size: 15px; line-height: 1.5;">Улаанбаатар хот, Баянгол дүүрэг, 9-р хороо, 21/3 Шаазгай Сүлжээ төв байр</p>
  </div>
</div>

<h3 style="margin-top: 40px; margin-bottom: 16px;">Манай байршил</h3>
<div style="border-radius: 12px; overflow: hidden; height: 300px; background: #eee;">
  <!-- Google Maps placeholder -->
  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2673.7431526685816!2d106.877013!3d47.915749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDU0JzU2LjciTiAxMDbCsDUyJzM3LjIiRQ!5e0!3m2!1sen!2smn!4v1620000000000!5m2!1sen!2smn" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
</div>
    `,
    publish: 1,
    list_order: 3
  }
];

async function main() {
  for (const page of pages) {
    const existing = await prisma.page.findUnique({
      where: { purl: page.purl }
    });
    
    if (existing) {
      console.log("Updating " + page.purl + "...");
      await prisma.page.update({
        where: { purl: page.purl },
        data: page
      });
    } else {
      console.log("Creating " + page.purl + "...");
      await prisma.page.create({
        data: page
      });
    }
  }
  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
