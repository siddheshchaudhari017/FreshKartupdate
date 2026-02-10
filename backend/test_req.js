console.log('Testing requires...');
try { require('./routes/authRoutes'); console.log('authRoutes OK'); } catch (e) { console.error('authRoutes FAIL:', e.message); }
try { require('./routes/productRoutes'); console.log('productRoutes OK'); } catch (e) { console.error('productRoutes FAIL:', e.message); }
try { require('./routes/orderRoutes'); console.log('orderRoutes OK'); } catch (e) { console.error('orderRoutes FAIL:', e.message); }
try { require('./routes/uploadRoutes'); console.log('uploadRoutes OK'); } catch (e) { console.error('uploadRoutes FAIL:', e.message); }
try { require('./middleware/errorMiddleware'); console.log('errorMiddleware OK'); } catch (e) { console.error('errorMiddleware FAIL:', e.message); }
try { require('./config/db'); console.log('db OK'); } catch (e) { console.error('db FAIL:', e.message); }
console.log('Done.');
